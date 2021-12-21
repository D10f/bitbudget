import React from "react";
import styled from "styled-components";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { loginUser } from "../../../features/user/userSlice";
import { addNotification } from "../../../features/notifications/notificationsSlice";
import { loginValidationSchema } from "../../../common/validators/loginSchema";
import { useAppDispatch } from "../../../common/hooks/useAppDispatch";

import FormControl from "../../../common/components/Form/FormControl";
import TextInput from "../../../common/components/Form/TextInput";
import Button from "../../../common/components/Button/Button";

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
    dispatch(loginUser(data))
      .then(() =>
        dispatch(
          addNotification({ msg: "Logged in successfully", type: "success" })
        )
      )
      .catch(console.error);
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <Controller
          name="username"
          control={control}
          defaultValue="Morty666"
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
          defaultValue="password"
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
