'use client'
import React, { createContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface ErrorContextType {
    show: boolean;
    setShow: (show: boolean) => void;
    hasError: boolean;
    errorMessage: string;
    setError: (error: boolean, message: string) => void;
}

// Create the context with a default value of undefined
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Create the provider component
export const ErrorProvider = ({ children }: {children: ReactNode}) => {
    const [show, setShow] = React.useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const setError = (error: boolean, message: string) => {
        setShow(true);
        setHasError(error);
        setErrorMessage(message);
    };

    return (
        <ErrorContext.Provider value={{show, hasError, errorMessage,setShow, setError }}>
            {children}
        </ErrorContext.Provider>
    );
};

// Export the context to use it in other components
export default ErrorContext;
