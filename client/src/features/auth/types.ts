import { UserData } from '@features/user/types';

export type AuthResponse = {
    user: Pick<UserData, 'name' | 'email'>;
    accessToken: string;
};

export type Credentials = {
    name: string;
    email?: string;
    password: string;
};
