import React from "react";
import styled from "styled-components";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { signupUser } from "../../../features/user/userSlice";
import { addNotification } from "../../../features/notifications/notificationsSlice";
import { signupValidationSchema } from "../../../common/validators/signupSchema";
import { useAppDispatch } from "../../../common/hooks/useAppDispatch";

import FormControl from "../../../common/components/Form/FormControl";
import TextInput from "../../../common/components/Form/TextInput";
import Button from "../../../common/components/Button/Button";

type FormTypes = {
  username: string;
  email?: string;
  password: string;
  confirmPassword: string;
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2rem;
`;

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
    dispatch(signupUser(data))
      .then(() => {
        dispatch(
          addNotification({ msg: "Signup Successfully", type: "success" })
        );
      })
      .catch((error) => {
        dispatch(addNotification({ msg: error.message, type: "error" }));
      });
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
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
    </StyledForm>
  );
};

export default SignupForm;
