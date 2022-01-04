import React from "react";
import { v4 as uuid} from 'uuid';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { expenseValidationSchema } from "../../common/validators/expenseSchema";
import { selectCategories } from "../categories/categoriesSlice";
import { useAppSelector } from "../../common/hooks/useAppSelector";
import { useAppDispatch } from "../../common/hooks/useAppDispatch";
import { createExpense, updateExpense } from "./expensesSlice";

import FormContainer from "../../common/components/Form/FormContainer/FormContainer";
import FormControl from "../../common/components/Form/FormControl/FormControl";
import Button from "../../common/components/Button/Button";
import TextInput from "../../common/components/Form/TextInput/TextInput";
import SelectInput from "../../common/components/Form/SelectInput/SelectInput";
import TextArea from "../../common/components/Form/TextArea/TextArea";
import DatePicker from "../../common/components/Form/DatePicker/DatePicker";

interface IExpenseFormProps {
  walletId: string;
  expense?: IExpense;
  submitCallback: () => void;
}

type FormTypes = {
  title: string;
  amount: string;
  description: string;
  category: string;
  createdAt: string;
};

const ExpenseForm = ({ walletId, expense, submitCallback }: IExpenseFormProps) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormTypes>({
    resolver: joiResolver(expenseValidationSchema),
  });

  const onSubmit: SubmitHandler<FormTypes> = (data) => {
    const expenseData: IExpense = {
      id: expense?.id || uuid(),
      walletId,
      ...data
    };
    dispatch(expense ? updateExpense(expenseData) : createExpense(expenseData));
    submitCallback();
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <Controller
          name="title"
          control={control}
          defaultValue={expense?.title || ""}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Title"
              placeholder="e.g., New phone charger"
              autoFocus={true}
              error={Boolean(errors.title)}
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
          defaultValue={expense ? expense.createdAt : ""}
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
              options={categories}
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
    </FormContainer>
  );
};

export default ExpenseForm;
