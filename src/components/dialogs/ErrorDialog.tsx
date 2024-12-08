'use client'
import React, {useContext, useEffect} from 'react';
import { Modal } from 'antd';
import ErrorContext from "@/contex/errorContext";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {resetAuthError} from "@/slices/authenticationSlice";
import {resetMessagingError} from "@/slices/messagingSlice";
import {resetConfirmBookingError} from "@/slices/confirmBookingSlice";
import {resetStayError} from "@/slices/staysSlice";
import {resetBookingError} from "@/slices/bookingSlice";


export default function ErrorDialog() {
    const errorContext = useContext(ErrorContext);
    const dispatch = useAppDispatch()
    if (!errorContext) {
        throw new Error('Error Context Must be provided');
    }
    const {show, hasError, errorMessage, setError,setShow } = errorContext;


    const {hasError: messagingError, errorMessage: messagingErrorMessage
    } = useAppSelector(state => state.messaging)
    const {status, error} = useAppSelector(state => state.confirmBooking)
    const {
        hasError: authError,
        errorMessage: authErrorMessage
    } = useAppSelector(state => state.authentication)
    const {hasError: staysHasError, errorMessage: staysErrorMessage} = useAppSelector(state => state.stays)

    const {hasError: bookingError,errorMessage: bookingErrorMessage} = useAppSelector(state => state.bookings)
    useEffect(() => {
        if (authError) {
            setError(authError, authErrorMessage)
        } else if (messagingError) {
            setError(messagingError, messagingErrorMessage)
        } else if (status === 'failed' && error) {
            setError(true, error)
        } else if (staysHasError) {
            setError(staysHasError, staysErrorMessage)
        } else if (bookingError){
            setError(bookingError, bookingErrorMessage)
        }
    }, [authError, authErrorMessage, bookingError, bookingErrorMessage, error, messagingError, messagingErrorMessage, setError, status, staysErrorMessage, staysHasError]);

    const handleClose = () => {
        setError(false, '');
        setShow(false);
        dispatch(resetAuthError());
        dispatch(resetMessagingError());
        dispatch(resetConfirmBookingError());
        dispatch(resetStayError());
        dispatch(resetBookingError());
    };

    return (
        <Modal
            title="An error has occurred"
            open={show}
            onCancel={handleClose}
            footer={null}
        >
            <p>{errorMessage}</p>
        </Modal>
    );
}
