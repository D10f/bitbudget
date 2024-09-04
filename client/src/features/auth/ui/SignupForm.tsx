import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@features/store.ts';
import { useSignupMutation } from '@app/api/auth';
import { setToken, setUser } from '@features/auth/authSlice';
import { formErrorHandler } from '../../../helpers/formErrorHandler';
import { pbkdf2Hash } from '../../../services/crypto';
import { Buffer } from '../../../services/Buffer';

const signupFormSchema = z
    .object({
        name: z.string().min(3).max(255),
        email: z.string().max(255).email(),
        password: z.string().min(8).max(255),
        confirm: z.string(),
    })
    .refine(({ password, confirm }) => password === confirm, {
        message: 'Passwords do not match.',
        path: ['confirm'],
    });

type FormTypes = z.infer<typeof signupFormSchema>;

export default function SignupForm() {
    const dispatch = useAppDispatch();
    const [signup] = useSignupMutation();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormTypes>({ resolver: zodResolver(signupFormSchema) });

    const onSubmit = async ({ name, email, password }: FormTypes) => {
        try {
            const ha = await pbkdf2Hash(password, password);

            const authHash = await Buffer.from(ha).hex;

            const userData = await signup({
                name,
                email,
                password: authHash,
            }).unwrap();
            //dispatch(setToken(userData.accessToken));
            //dispatch(setUser(userData.user));
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
                <label htmlFor="name">Name</label>
                {errors.name && <p>{errors.name.message}</p>}
            </div>

            <div>
                <input {...register('email')} type="text" id="email" />
                <label htmlFor="email">Email</label>
                {errors.email && <p>{errors.email.message}</p>}
            </div>

            <div>
                <input {...register('password')} type="text" id="password" />
                <label htmlFor="password">Password</label>
                {errors.password && <p>{errors.password.message}</p>}
            </div>

            <div>
                <input {...register('confirm')} type="text" id="confirm" />
                <label htmlFor="confirm">Confirm Password</label>
                {errors.confirm && <p>{errors.confirm.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}>
                Submit
            </button>
        </form>
    );
}
