import React, { useState } from "react";
import styled from "styled-components";
import Button from "../Buttons/Button";
import FormControl from "./FormControl";
import TextInput from "./TextInput";

interface IExpenseFormProps {
  expense?: IExpense;
  submitCallback: () => void;
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2rem;
`;

const ExpenseForm = ({ expense }: IExpenseFormProps) => {
  const [name, setName] = useState(expense?.name || "");
  const [description, setDescription] = useState(expense?.name || "");
  const [amount, setAmount] = useState(expense?.amount || "0");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "name":
        return setName(e.target.value);
      case "amount":
        return setAmount(e.target.value);
      case "description":
        return setDescription(e.target.value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(name, amount, description);
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <FormControl>
        <TextInput
          label="Name"
          name="name"
          value={name}
          placeholder="e.g., New phone charger"
          autoFocus={true}
          onChange={handleInput}
        />
      </FormControl>

      <FormControl>
        <TextInput
          label="Amount"
          name="amount"
          value={amount}
          placeholder="e.g., 12.25"
          onChange={handleInput}
        />
      </FormControl>

      <Button type="submit" variant="action">
        {expense ? "Update" : "Create"}
      </Button>
    </StyledForm>
  );
};

export default ExpenseForm;
