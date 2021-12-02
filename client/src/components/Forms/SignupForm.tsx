import React from "react";
import styled from "styled-components";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { signupValidationSchema } from "../../common/validators/signupSchema";
import FormControl from "./FormControl";
import TextInput from "./TextInput";
import { useAppDispatch } from "../../app/hooks";
import { addNotification } from "../../features/ui/ui.reducer";
import Button from "../Buttons/Button";

type FormTypes = {
  username: string;
  email: string;
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
    dispatch(addNotification({ msg: 'Signup Successfully', type: 'success' }));
    console.log(data);
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <Controller
          name="username"
          control={control}
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
          defaultValue=""
          render={({ field }) => (
            <TextInput
              {...field}
              label="Email"
              placeholder="eg.: something@example.com (optional)"
              error={Boolean(errors.email)}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Password"
              type="password"
              placeholder="Chose wisely"
              error={Boolean(errors.password)}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Confirm Password"
              type="password"
              placeholder="(seriously)"
              error={Boolean(errors.confirmPassword)}
            />
          )}
        />
      </FormControl>

      <Button variant="action">
        Signup
      </Button>
    </StyledForm>
  );
};

export default SignupForm;
