import { FormEvent } from 'react';
import { useAppDispatch } from '@features/store.ts';
import { signupUser } from '@features/auth/authSlice';

export default function SignupForm() {
    const dispatch = useAppDispatch();

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        dispatch(
            signupUser({
                username: 'luigi',
                email: 'luigi@example.com',
                password: 'iamnotmario',
            }),
        );
    }

    return (
        <form onSubmit={(e) => onSubmit(e)}>
            <div>
                <input type="text" id="email" />
                <label htmlFor="email">Email</label>
            </div>
            <div>
                <input type="password" id="password" />
                <label htmlFor="password">Password</label>
            </div>

            <button type="submit">Submit</button>
        </form>
    );
}
