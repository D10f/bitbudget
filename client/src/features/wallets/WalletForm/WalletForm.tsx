import React from "react";
import styled from "styled-components";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { v4 as uuid} from 'uuid';

import { joiResolver } from "@hookform/resolvers/joi";
import { addWalletAsync, updateWalletAsync } from "../../../features/wallets/walletsSlice";
import { useAppDispatch } from "../../../common/hooks/useAppDispatch";
import { walletValidationSchema } from "../../../common/validators/walletSchema";

import Button from "../../../common/components/Button/Button";
import FormControl from "../../../common/components/Form/FormControl";
import SelectInput from "../../../common/components/Form/SelectInput";
import TextInput from "../../../common/components/Form/TextInput";

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
      id: wallet?.id || uuid(),
      isCurrent: wallet?.isCurrent || false,
      ...data,
    };
    dispatch(wallet ? updateWalletAsync(walletObject) : addWalletAsync(walletObject));
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
