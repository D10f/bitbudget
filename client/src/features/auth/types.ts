import { User } from '@features/user/types';

export type AuthSignupResponse = {
    user: Pick<User, 'name' | 'email'>;
    accessToken: string;
};

export type AuthLoginResponse = {
    user: Pick<User, 'name' | 'email'> & { prefs: string; vaultKey: string };
    accessToken: string;
};

export type Credentials = {
    name: string;
    email?: string;
    password: string;
};
