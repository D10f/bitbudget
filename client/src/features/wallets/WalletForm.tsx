import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { joiResolver } from "@hookform/resolvers/joi";

import { addWalletAsync, updateWalletAsync } from "./walletsSlice";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { walletValidationSchema } from "@validators/walletSchema";

import FormContainer from "@components/Form/FormContainer/FormContainer";
import FormControl from "@components/Form/FormControl/FormControl";
import SelectInput from "@components/Form/SelectInput/SelectInput";
import TextInput from "@components/Form/TextInput/TextInput";
import Button from "@components/Button/Button";

interface IWalletFormProps {
  wallet?: IWallet;
  submitCallback: () => void;
}

type FormTypes = {
  name: string;
  currency: string;
  budget: string;
};

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
    dispatch(
      wallet ? updateWalletAsync(walletObject) : addWalletAsync(walletObject)
    );
    submitCallback();
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
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
    </FormContainer>
  );
};

export default WalletForm;
