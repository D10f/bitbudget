import React from 'react';
import styled from 'styled-components';
import { joiResolver } from '@hookform/resolvers/joi';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAppSelector } from '../../../common/hooks/useAppSelector';
import { profileValidationSchema } from '../../../common/validators/profileSchema';

import Button from '../../../common/components/Button/Button';
import FormControl from '../../../common/components/Form/FormControl';
import TextInput from '../../../common/components/Form/TextInput';

interface FormTypes {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface IUserProfile {
  submitCallback: () => void;
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2rem;
  margin: 0 2rem;
`;

const UserProfile = ({ submitCallback }: IUserProfile) => {

  const { user } = useAppSelector(state => state.user);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormTypes>({
    resolver: joiResolver(profileValidationSchema),
  });

  const onSubmit: SubmitHandler<FormTypes> = (data) => {
    console.log(data);
    submitCallback();
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <Controller
          name="username"
          control={control}
          defaultValue={user?.username}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Username"
              placeholder="Your username"
              autoFocus={true}
              readOnly={true}
              error={Boolean(errors.username)}
            />
          )}
        />
      </FormControl>
      
      <FormControl>
        <Controller
          name="email"
          control={control}
          defaultValue={user?.email || ""}
          render={(test) => (
            <TextInput
              {...test.field}
              required={false}
              label="Email"
              placeholder="email@example.com"
              error={Boolean(errors.email)}
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
              label="New Password"
              placeholder=""
              error={Boolean(errors.password)}
            />
          )}
        />
      </FormControl>
      
      <FormControl>
        <Controller
          name="confirmPassword"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextInput
              {...field}
              label="Confirm New Password"
              placeholder=""
              error={Boolean(errors.confirmPassword)}
            />
          )}
        />
      </FormControl>
      
      <Button type="submit" variant="action">
        Save
      </Button>
    </StyledForm>
  );
};

export default UserProfile;