import { Routes, Route } from 'react-router-dom';
import LoginForm from '@features/auth/ui/LoginForm';
import SignupForm from '@features/auth/ui/SignupForm';
import AppLayout from '@components/AppLayout';

export default function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route index element={<h1>Hello</h1>} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/login" element={<LoginForm />} />
            </Route>
        </Routes>
    );
}
