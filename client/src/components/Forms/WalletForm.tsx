import React from "react";
import styled from "styled-components";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { joiResolver } from '@hookform/resolvers/joi';
import { useAppDispatch } from "../../app/hooks";
import { updateWallet } from "../../features/wallets/wallets.reducer";
import { walletValidationSchema } from "../../common/validators/walletSchema";
import { addNotification } from "../../features/ui/ui.reducer";
import Button from "../Buttons/Button";
import FormControl from "./FormControl";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";

interface IWalletFormProps {
  wallet?: IWallet;
  submitCallback: () => void;
}

type FormTypes = {
  name: string;
  currency: string;
  budget: string;
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2rem;
`;

const WalletForm = ({ wallet, submitCallback }: IWalletFormProps) => {
  const dispatch = useAppDispatch();
  const { handleSubmit, control, formState: { errors } } = useForm<FormTypes>({
    resolver: joiResolver(walletValidationSchema)
  });

  const onSubmit: SubmitHandler<FormTypes> = (data) => {
    dispatch(addNotification({ msg: 'Wallet Updated Successfully', type: 'success' }))
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <Controller
          name="name"
          control={control}
          defaultValue={wallet?.name || ""}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Name"
              placeholder="e.g., Trip to Malta"
              autoFocus={true}
              error={Boolean(errors.name)}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <Controller
          name="currency"
          control={control}
          defaultValue={wallet?.currency || "EUR"}
          render={({ field }) => (
            <>
              <SelectInput
                {...field}
                label="Currency"
                options={["EUR", "USD", "GBP", "AUD", "SGP", "JPY", "CNY", "INR"]}
                error={Boolean(errors.currency)}
              />
            </>
          )}
        />
      </FormControl>

      <FormControl>
        <Controller
          name="budget"
          control={control}
          defaultValue={wallet?.budget || "0"}
          render={({ field }) => (
            <>
              <TextInput {...field} label="Budget" placeholder="e.g., 278.32" error={Boolean(errors.budget)} />
            </>
          )}
        />
      </FormControl>

      <Button type="submit" variant="action">
        {wallet ? "Update" : "Create"}
      </Button>
    </StyledForm>
  );
};

export default WalletForm;
