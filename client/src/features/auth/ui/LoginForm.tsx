import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '@app/api/auth';
import { useAppDispatch } from '@app/store';
import { formErrorHandler } from '@helpers/formErrorHandler';
import type { UserPrefs } from '@features/user/types';
import { addKey, setUserData, setUserPrefs } from '@features/user/userSlice';
import { generateMasterKey } from '@services/keys';
import { SymmetricKey } from '@services/SymmetricKey';
import { setToken } from '../authSlice';

const loginFormSchema = z.object({
    name: z.string().min(3).max(255),
    password: z.string().min(8).max(255),
});

type FormTypes = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [login] = useLoginMutation();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormTypes>({ resolver: zodResolver(loginFormSchema) });

    const onSubmit = async ({ name, password }: FormTypes) => {
        try {
            const { key, hash } = await generateMasterKey(name, password);
            const res = await login({ name, password: hash }).unwrap();
            const vaultKey = await SymmetricKey.fromWrap(
                res.user.vaultKey,
                key,
            );
            const userPrefs = await vaultKey.decrypt<UserPrefs>(res.user.prefs);

            dispatch(
                setUserData({ name: res.user.name, email: res.user.email }),
            );
            dispatch(setUserPrefs(userPrefs));
            dispatch(setToken(res.accessToken));
            dispatch(addKey(await key.toJSON()));
            dispatch(addKey(await vaultKey.toJSON()));
            navigate('/');
        } catch (e) {
            formErrorHandler<FormTypes>(e, setError);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {errors.root && (
                <div>
                    <p>{errors.root.message}</p>
                </div>
            )}
            <div>
                <input {...register('name')} type="text" id="name" />
                <label htmlFor="name">Username or email</label>
                {errors.name && <p>{errors.name.message}</p>}
            </div>

            <div>
                <input {...register('password')} type="text" id="password" />
                <label htmlFor="password">Password</label>
                {errors.password && <p>{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}>
                Login
            </button>
        </form>
    );
}
