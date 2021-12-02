import React from "react";
import styled from "styled-components";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { expenseValidationSchema } from "../../common/validators/expenseSchema";
import { addNotification } from "../../features/ui/ui.reducer";
import { useAppDispatch } from "../../app/hooks";

import Button from "../Buttons/Button";
import FormControl from "./FormControl";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import TextArea from "./TextArea";
import DatePicker from './DatePicker';

const DEFAULT_CATEGORIES = ["Travel", "Groceries", "Electronics", "Food"];

interface IExpenseFormProps {
  expense?: IExpense;
  submitCallback: () => void;
}

type FormTypes = {
  name: string;
  amount: string;
  description: string;
  category: string;
  createdAt: string;
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2rem;
`;

const ExpenseForm = ({ expense }: IExpenseFormProps) => {
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormTypes>({
    resolver: joiResolver(expenseValidationSchema),
  });

  const onSubmit: SubmitHandler<FormTypes> = (data) => {
    dispatch(
      addNotification({ msg: "Expense Created Successfully", type: "success" })
    );
    console.log(data);
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <Controller
          name="name"
          control={control}
          defaultValue={expense?.name || ""}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Name"
              placeholder="e.g., New phone charger"
              autoFocus={true}
              error={Boolean(errors.name)}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <Controller
          name="amount"
          control={control}
          defaultValue={expense?.amount || ""}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Amount"
              placeholder="e.g., 9.95"
              error={Boolean(errors.amount)}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <Controller
          name="createdAt"
          control={control}
          defaultValue={expense?.createdAt || ''}
          render={({ field }) => (
            <DatePicker
              {...field}
              label="Date"
              error={Boolean(errors.createdAt)}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <Controller
          name="category"
          control={control}
          defaultValue={expense?.category || "Travel"}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Category"
              options={DEFAULT_CATEGORIES}
              error={Boolean(errors.category)}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <Controller
          name="description"
          control={control}
          defaultValue={expense?.description || ""}
          render={({ field }) => (
            <TextArea
              {...field}
              label="Description"
              placeholder="e.g., Stop on the way Waterfall"
              error={Boolean(errors.description)}
            />
          )}
        />
      </FormControl>

      <Button type="submit" variant="action">
        {expense ? "Update" : "Create"}
      </Button>
    </StyledForm>
  );
};

export default ExpenseForm;
