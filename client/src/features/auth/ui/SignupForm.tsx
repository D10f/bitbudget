import { FormEvent } from 'react';
import { useAppDispatch } from '@features/store.ts';
import { useSignupMutation } from '@app/api/auth';
import { setToken } from '../authSlice';
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
    const dispatch = useAppDispatch();
    const [signup] = useSignupMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const credentials = {
            name: 'luigi',
            email: 'luigi@example.com',
            password: 'iamnotmario123!',
        };

        try {
            const userData = await signup(credentials).unwrap();
            dispatch(setToken(userData.token));
            navigate('/app');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input type="text" id="name" />
                <label htmlFor="name">Name</label>
            </div>

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
