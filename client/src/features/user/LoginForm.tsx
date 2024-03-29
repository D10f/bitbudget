import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { loginUser } from "@features/user/userSlice";
import { loginValidationSchema } from "@validators/loginSchema";
import { useAppDispatch } from "@hooks/useAppDispatch";

import FormContainer from '@components/Form/FormContainer/FormContainer';
import FormControl from "@components/Form/FormControl/FormControl";
import TextInput from "@components/Form/TextInput/TextInput";
import Button from "@components/Button/Button";

type FormTypes = {
  username: string;
  password: string;
};

const LoginForm = () => {
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormTypes>({
    resolver: joiResolver(loginValidationSchema),
  });

  const onSubmit: SubmitHandler<FormTypes> = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <Controller
          name="username"
          control={control}
          defaultValue="Luigi"
          render={({ field }) => (
            <TextInput
              {...field}
              label="Username"
              autoFocus={true}
              placeholder="eg.: Luigi"
              error={Boolean(errors.username)}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <Controller
          name="password"
          control={control}
          defaultValue="iamnotmario"
          render={({ field }) => (
            <TextInput
              {...field}
              label="Password"
              type="password"
              placeholder="eg.: iamnotmario"
              error={Boolean(errors.password)}
            />
          )}
        />
      </FormControl>

      <Button variant="action">Login</Button>
    </FormContainer>
  );
};

export default LoginForm;
