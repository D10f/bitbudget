export type FormError<T> = {
    property: keyof T;
    message: string;
};

export type FormValidationErrors<T> = {
    data: string;
    statusCode: 422;
    message: FormError<T>[];
};
