import React from "react";
import styled from "styled-components";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { updateWallet } from "../../../features/wallets/wallets.reducer";
import { addNotification } from "../../../features/notifications/notifications.reducer";
import { walletValidationSchema } from "../../validators/walletSchema";

import Button from "../../components/Button/Button";
import FormControl from "../../components/Form/FormControl";
import SelectInput from "../../components/Form/SelectInput";
import TextInput from "../../components/Form/TextInput";

interface IWalletFormProps {
  wallet?: IWallet;
  submitCallback: () => void;
}

type FormTypes = {
  name: string;
  currency: string;
  budget: string;
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2rem;
  margin: 0 2rem;
`;

const WalletForm = ({ wallet, submitCallback }: IWalletFormProps) => {
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormTypes>({
    resolver: joiResolver(walletValidationSchema),
  });

  const onSubmit: SubmitHandler<FormTypes> = (data) => {
    const walletObject = {
      id: wallet?.id || "",
      isCurrent: wallet?.isCurrent || false,
      ...data,
    };
    dispatch(updateWallet(walletObject));
    dispatch(
      addNotification({ msg: "Wallet Updated Successfully", type: "success" })
    );
    submitCallback();
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
                options={[
                  "EUR",
                  "USD",
                  "GBP",
                  "AUD",
                  "SGP",
                  "JPY",
                  "CNY",
                  "INR",
                ]}
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
              <TextInput
                {...field}
                label="Budget"
                placeholder="e.g., 278.32"
                error={Boolean(errors.budget)}
              />
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
