import { useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import numeral from 'numeral';
import { expenseSchema } from '../../utils/schemas';
import useFormValidation from '../../hooks/useFormValidation';

import { SingleDatePicker } from 'react-dates';
import Form from '../../components/Form';
import FormControl from '../../components/FormControl';
import TextInput from '../../components/TextInput';
import TextArea from '../../components/TextArea';
import Dropdown from '../../components/Dropdown';
import Button from '../../components/Button';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

const ExpenseForm = ({
  expense,
  categories,
  onSubmit,
  handleRemove = () => {},
  isLoading = false
}) => {

  const validateSchema = useFormValidation(expenseSchema);

  const [ createdAt, setCreatedAt ] = useState(expense ? moment(expense.createdAt) : moment());
  const [ calendarFocus, setCalendarFocus ] = useState(false);
  const [ title, setTitle ] = useState(expense ? expense.title : '');
  const [ amount, setAmount ] = useState(expense ? numeral(expense.amount / 100).format(`0,0.00`) : '');
  const [ description, setDescription ] = useState(expense ? expense.description : '');
  const [ category, setCategory ] = useState(expense ? expense.category : categories[0]);

  const onAmountChange = e => {
    const amount = e.target.value;
    if (!amount || amount.match(/^\d+(\.\d{0,2})?$/)) {
      setAmount(amount);
    }
  };

  const onDateChange = createdAt => createdAt && setCreatedAt(createdAt);

  const onSubmitWithValidation = validateSchema({
    createdAt, title, amount, description, category
  }, onSubmit);

  return (
    <Form onSubmit={onSubmitWithValidation} >
      <FormControl modifiers="mb-1">
        <label htmlFor="date" className="form__label">Date</label>
        <SingleDatePicker
          id="date"
          date={createdAt}
          onDateChange={onDateChange}
          focused={calendarFocus}
          onFocusChange={({ focused }) => setCalendarFocus(focused)}
          numberOfMonths={1}
          isOutsideRange={() => false}
          displayFormat="DD/MM/YYYY"
        />
      </FormControl>

      <FormControl>
        <TextInput
          label="Title"
          value={title}
          name="title"
          placeholder="e.g., Coffee on the road"
          onChange={e => setTitle(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <TextInput
          label="Amount"
          value={amount}
          name="amount"
          placeholder="e.g., 2.65"
          onChange={onAmountChange}
        />
      </FormControl>

      <FormControl>
        <TextArea
          label="Description"
          value={description}
          name="description"
          placeholder="e.g., On the way to the Algarve"
          onChange={e => setDescription(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <Dropdown
          label="Category"
          name="category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          options={categories}
        />
      </FormControl>

      <FormControl modifiers="form__control-group--center mt-2">
        <Button
          text={expense ? "Save Changes" : "Add New Expense"}
          type="submit"
          loading={isLoading}
        />
        { expense && (
          <Button
            text="Delete"
            type="button"
            loading={isLoading}
            onClick={handleRemove}
          />
        )}
      </FormControl>
    </Form>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.wallets.isLoading,
  categories: state.categories
});
//
// const mapDispatchToProps = (dispatch) => ({
//   startAddExpense: (expense) => dispatch(startAddExpense(expense))
// });

export default connect(mapStateToProps)(ExpenseForm);
