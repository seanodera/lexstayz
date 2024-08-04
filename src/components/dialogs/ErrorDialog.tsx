'use client'
import React from 'react';
import { Modal } from 'antd';
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { resetError, selectErrorMessage, selectHasError } from "@/slices/staysSlice";

export default function ErrorDialog() {
    const hasError = useAppSelector(selectHasError);
    const message = useAppSelector(selectErrorMessage);
    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(resetError());
    };

    return (
        <Modal
            title="An error has occurred"
            open={hasError}
            onCancel={handleClose}
            footer={null}
        >
            <p>{message}</p>
        </Modal>
    );
}
