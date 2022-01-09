import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { signupUser } from "@features/user/userSlice";
import { signupValidationSchema } from "@validators/signupSchema";
import { useAppDispatch } from "@hooks/useAppDispatch";

import FormContainer from "@components/Form/FormContainer/FormContainer";
import FormControl from "@components/Form/FormControl/FormControl";
import TextInput from "@components/Form/TextInput/TextInput";
import Button from "@components/Button/Button";

type FormTypes = {
  username: string;
  email?: string;
  password: string;
  confirmPassword: string;
};

const SignupForm = () => {
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormTypes>({
    resolver: joiResolver(signupValidationSchema),
  });

  const onSubmit: SubmitHandler<FormTypes> = (data) => {
    dispatch(signupUser(data));
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <Controller
          name="username"
          control={control}
          defaultValue="Morty"
          render={({ field }) => (
            <TextInput
              {...field}
              label="Username"
              autoFocus={true}
              placeholder="eg.: CrazyTrain98"
              error={Boolean(errors.username)}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <Controller
          name="email"
          control={control}
          defaultValue="some@example.com"
          render={({ field }) => (
            <TextInput
              {...field}
              label="Email"
              required={false}
              placeholder="eg.: something@example.com"
              error={Boolean(errors.email)}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <Controller
          name="password"
          control={control}
          defaultValue="password"
          render={({ field }) => (
            <TextInput
              {...field}
              label="Password"
              type="password"
              placeholder="Choose a strong password"
              error={Boolean(errors.password)}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <Controller
          name="confirmPassword"
          control={control}
          defaultValue="password"
          render={({ field }) => (
            <TextInput
              {...field}
              label="Confirm Password"
              type="password"
              placeholder=""
              error={Boolean(errors.confirmPassword)}
            />
          )}
        />
      </FormControl>

      <Button variant="action">Signup</Button>
    </FormContainer>
  );
};

export default SignupForm;
