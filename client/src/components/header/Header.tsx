import { Link } from 'react-router-dom';
import { useAppSelector } from '@app/store';
import { selectAccessToken } from '@features/auth/authSlice';

export default function Header() {
    const accessToken = useAppSelector(selectAccessToken);

    return (
        <header>
            <h1>Welcome to the app</h1>
            <p>You are currently not logged in.</p>
            {accessToken ? (
                <p>Welcome</p>
            ) : (
                <nav>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                </nav>
            )}
        </header>
    );
}
