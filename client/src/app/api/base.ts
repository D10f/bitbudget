/**
 * This code is a TypeScript implementation of Dave Gray's redux_jwt_auth git
 * repository.
 *
 * It creates a base-case query that reacts to 403 (forbidden) responses, which
 * indicate that the access token sent as part of the request has expired. It
 * then attempts to refresh the token and retry the original request.
 *
 * https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#common-usage-patterns
 * https://github.com/gitdagray/redux_jwt_auth/tree/main
 */

import {
    createApi,
    fetchBaseQuery,
    BaseQueryFn,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '@app/store';
import { logout, setToken } from '@features/auth/authSlice';
import { HTTP_STATUS } from '../../types/http';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5000',
    credentials: 'same-origin',
    prepareHeaders(headers, { getState }) {
        const token = (getState() as RootState).auth.token;

        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }

        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === HTTP_STATUS.FORBIDDEN) {
        // attempt to refresh access token
        const refreshTokenResult = await baseQuery(
            '/auth/refresh',
            api,
            extraOptions,
        );

        if (refreshTokenResult.data) {
            api.dispatch(setToken(refreshTokenResult.data as string));
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
    }

    return result;
};

export const baseApi = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
});
