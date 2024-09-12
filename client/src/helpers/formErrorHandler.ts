import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { ErrorOption } from 'react-hook-form';
import { FormValidationErrors } from '../types/error';
import { HTTP_STATUS } from '../types/http';

export function formErrorHandler<T>(
    e: unknown,
    setError: (name: keyof T | 'root', error: ErrorOption) => void,
) {
    const err = e as FetchBaseQueryError;

    // catches general errors (network, timeout, etc)
    if ('error' in err) {
        setError('root', { message: err.error });
        return;
    } else if ('message' in err) {
        setError('root', { message: (e as Error).message });
        return;
    } else if (err.status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        const validationErrors = err.data as FormValidationErrors<T>;

        validationErrors.message.forEach(({ property, message }) => {
            setError(property, { message });
        });
    } else {
        setError('root', { message: err.data!.message });
    }
}
