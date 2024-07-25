import { useAppSelector } from '@features/store.ts';
import SignupForm from '@features/auth/ui/SignupForm';

export default function App() {
    const isAuthenticated = useAppSelector((state) => state.auth.token);
    const isLoading = useAppSelector((state) => state.auth.loading);
    const token = useAppSelector((state) => state.auth.token);

    return (
        <header>
            <h1>Welcome to the app</h1>
            <p>{isLoading ? '' : 'NOT'} loading</p>
            <p>Token value is: {token}</p>
            <p>You are currently {isAuthenticated ? '' : 'NOT'} logged in.</p>
            {!isAuthenticated && <SignupForm />}
        </header>
    );
}
