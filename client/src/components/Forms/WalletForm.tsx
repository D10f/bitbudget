import React, { useState } from "react";
import styled from "styled-components";
import { useAppDispatch } from "../../app/hooks";
import { updateWallet } from "../../features/wallets/wallets.reducer";
import { walletValidationSchema } from "../../common/validators/walletSchema";
import Button from "../Buttons/Button";
import FormControl from "./FormControl";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import { addNotification } from "../../features/ui/ui.reducer";

interface IWalletFormProps {
  wallet: IWallet;
  submitCallback: () => void;
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2rem;
`;

const WalletForm = ({ wallet, submitCallback }: IWalletFormProps) => {
  const [name, setName] = useState(wallet.name || "");
  const [currency, setCurrency] = useState(wallet.currency || "");
  const [budget, setBudget] = useState(wallet.budget || "0");

  const dispatch = useAppDispatch();

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    switch (e.target.name) {
      case "name":
        return setName(e.target.value);
      case "currency":
        return setCurrency(e.target.value);
      case "budget":
        return setBudget(e.target.value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error, value } = walletValidationSchema.validate({
      name,
      currency,
      budget,
    });
    if (error) {
      console.log(error.name);
      console.log(error.message);
      console.log(error.details);
    } else {
      console.log(value);
      dispatch(updateWallet({ id: wallet.id, name, currency, budget, isCurrent: wallet.isCurrent }));
      submitCallback();
      dispatch(addNotification({ msg: "Wallet Updated Successfully", type: 'success' }));
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <FormControl>
        <TextInput
          label="Name"
          name="name"
          value={name}
          placeholder="e.g., Trip to Malta"
          autoFocus={true}
          readOnly={false}
          onChange={handleInput}
        />
      </FormControl>

      <FormControl>
        <SelectInput
          label="Currency"
          name="currency"
          value={currency}
          options={["EUR", "USD", "GBP", "AUD", "SGP", "JPY", "CNY", "INR"]}
          onChange={handleInput}
        />
      </FormControl>

      <FormControl>
        <TextInput
          label="Budget"
          name="budget"
          value={budget}
          placeholder="e.g., 278.32"
          readOnly={false}
          onChange={handleInput}
        />
      </FormControl>

      <Button type="submit" variant="action">
        { wallet ? "Update" : "Create" }
      </Button>
    </StyledForm>
  );
};

export default WalletForm;
