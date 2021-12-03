import React from "react";
import styled from "styled-components";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { expenseValidationSchema } from "../../validators/expenseSchema";
import { addNotification } from "../../../features/notifications/notifications.reducer";
import { useAppDispatch } from "../../hooks/useAppDispatch";

import Button from "../../components/Button/Button";
import FormControl from "../../components/Form/FormControl";
import TextInput from "../../components/Form/TextInput";
import SelectInput from "../../components/Form/SelectInput";
import TextArea from "../../components/Form/TextArea";
import DatePicker from "../../components/Form/DatePicker";

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
          render={({ field }) => {
            console.log('render')
            return (
              <TextInput
                {...field}
                label="Name"
                placeholder="e.g., New phone charger"
                autoFocus={true}
                error={Boolean(errors.name)}
              />
            )
          }}
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
          defaultValue={expense?.createdAt || ""}
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