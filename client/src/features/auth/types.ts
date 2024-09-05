import { User } from '../../types/user';

export type AuthResponse = {
    user: User;
    accessToken: string;
};

export type Credentials = {
    name: string;
    email?: string;
    password: string;
};
