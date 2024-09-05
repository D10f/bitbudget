import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignupMutation } from '@app/api/auth';
import { formErrorHandler } from '../../../helpers/formErrorHandler';

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
            await signup({ name, email, password }).unwrap();
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
