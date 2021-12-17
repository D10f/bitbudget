import React from "react";
import styled from "styled-components";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { loginValidationSchema } from "../../validators/loginSchema";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { addNotification } from "../../../features/notifications/notifications.reducer";

import FormControl from "../../components/Form/FormControl";
import TextInput from "../../components/Form/TextInput";
import Button from "../../components/Button/Button";

type FormTypes = {
  username: string;
  password: string;
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2rem;
`;

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
    dispatch(addNotification({ msg: "Signup Successfully", type: "success" }));
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <Controller
          name="username"
          control={control}
          defaultValue=""
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
          name="password"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextInput
              {...field}
              label="Password"
              type="password"
              placeholder=""
              error={Boolean(errors.password)}
            />
          )}
        />
      </FormControl>

      <Button variant="action">Login</Button>
    </StyledForm>
  );
};

export default LoginForm;
