'use client'
import React, {useEffect, useState} from 'react';
import {Modal} from 'antd';
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {resetAuthError} from "@/slices/authenticationSlice";
import {resetMessagingError} from "@/slices/messagingSlice";
import {resetConfirmBookingError} from "@/slices/confirmBookingSlice";
import {resetStayError} from "@/slices/staysSlice";
import {resetBookingError} from "@/slices/bookingSlice";
import {analytics} from "@/lib/firebase";
import {logEvent} from "@firebase/analytics";


export default function ErrorDialog() {
    const dispatch = useAppDispatch()
    const [show, setShow] = React.useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const setError = (error: boolean, message: string) => {
        setShow(true);
        setHasError(error);
        setErrorMessage(message);
    };

    const {
        hasError: messagingError, errorMessage: messagingErrorMessage
    } = useAppSelector(state => state.messaging)
    const {status, error} = useAppSelector(state => state.confirmBooking)
    const {
        hasError: authError,
        errorMessage: authErrorMessage
    } = useAppSelector(state => state.authentication)
    const {hasError: staysHasError, errorMessage: staysErrorMessage} = useAppSelector(state => state.stays)

    const {hasError: bookingError, errorMessage: bookingErrorMessage} = useAppSelector(state => state.bookings)
    useEffect(() => {
        console.log(authError, authErrorMessage, bookingError, bookingErrorMessage, error, messagingError, messagingErrorMessage, status, staysErrorMessage, staysHasError)
        if (authError) {
            setError(authError, authErrorMessage)
        } else if (messagingError) {
            setError(messagingError, messagingErrorMessage)
        } else if (status === 'failed' && error) {
            setError(true, error)
        } else if (staysHasError) {
            setError(staysHasError, staysErrorMessage)
        } else if (bookingError) {
            setError(bookingError, bookingErrorMessage)
        }
    }, [authError, authErrorMessage, bookingError, bookingErrorMessage, error, messagingError, messagingErrorMessage, status, staysErrorMessage, staysHasError]);

    const handleClose = () => {
        setError(false, '');
        setShow(false);
        dispatch(resetAuthError());
        dispatch(resetMessagingError());
        dispatch(resetConfirmBookingError());
        dispatch(resetStayError());
        dispatch(resetBookingError());
    };
    useEffect(() => {
        if (hasError && error && errorMessage && analytics) {
            logEvent(analytics, "error_occurred", {
                error: error.toString(),
                message: errorMessage,
                timestamp: new Date().toISOString(),
            });
        }
    }, [error, errorMessage, hasError]);
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
