import { useState } from 'react';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';
import CategoryList from './CategoryList';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

const ExpenseForm = ({ onSubmit, expense }) => {

  const [text, setText] = useState({
    title: expense ? expense.title : '',
    description: expense ? expense.description : '',
    location: expense ? expense.location : ''
  });
  const [createdAt, setCreatedAt] = useState(expense ? moment(expense.createdAt) : moment());
  const [amount, setAmount] = useState(expense ? (expense.amount / 100).toString() : '');
  const [category, setCategory] = useState(expense ? expense.category : 'Other');
  const [calendarFocus, setCalendarFocus] = useState(false);
  const [error, setError] = useState(null);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setText({ ...text, [name]: value });
  };
  const onAmountChange = (e) => {
    const amount = e.target.value;
    if (!amount || amount.match(/^\d+(\.\d{0,2})?$/)) {
      setAmount(amount);
    }
  };
  const onDateChange = (createdAt) => {
    if (createdAt){
      setCreatedAt(createdAt);
    }
  };
  const onCategoryChange = (e) => {
    setCategory(e.target.id);
  };
  const onFocusChange = ({ focused }) => setCalendarFocus(focused);
  const onFormSubmit = (e) => {
    e.preventDefault()

    if (!text.description || !amount){
      setError('Please provide a description and amount for this expense.');
    } else {
      setError('');
      onSubmit({
        title: text.title,
        description: text.description,
        category: category,
        amount: parseFloat(amount, 10) * 100,
        createdAt: createdAt.valueOf(), // to return time in ms
        notes: text.title
      });
    }
  };

  return (
    <form
      onSubmit={onFormSubmit}
      className="form form--spaced"
    >

      {error && <p>{error}</p>}
      <div className="form__control-group">
        <label htmlFor="date" className="form__label">Date</label>
        <SingleDatePicker
          id="date"
          date={createdAt}
          onDateChange={onDateChange}
          focused={calendarFocus}
          onFocusChange={onFocusChange}
          numberOfMonths={1}
          isOutsideRange={() => false}
          displayFormat="DD/MM/YYYY"
        />
      </div>
      <div className="form__control-group">
        <label htmlFor="title" className="form__label">Title</label>
        <input
          className="form__input"
          onChange={onInputChange}
          value={text.title}
          name="title"
          id="title"
          type="text"
          placeholder="e.g., Lunch with friends"
          autoFocus
        />
      </div>
      <div className="form__control-group">
        <label htmlFor="amount" className="form__label">Amount</label>
        <input
          className="form__input"
          onChange={onAmountChange}
          value={amount}
          name="amount"
          id="amount"
          type="text"
          placeholder="e.g.: 2.35"
        />
      </div>
      <div className="form__control-group">
        <label htmlFor="location" className="form__label">Location</label>
        <input
          className="form__input"
          onChange={onInputChange}
          value={text.location}
          name="location"
          id="location"
          type="text"
          placeholder="e.g., Downtown Arcade"
        />
      </div>
      <div className="form__control-group">
        <label className="form__label">Theme</label>
        <CategoryList current={category} setCategory={onCategoryChange} />
      </div>
      <div className="form__control-group">
        <label htmlFor="description" className="form__label">Description</label>
        <textarea
          className="form__input form__textarea"
          onChange={onInputChange}
          value={text.description}
          name="description"
          id="description"
          placeholder="e.g.: Present for Emma"
          maxLength="250"
        >
        </textarea>
      </div>
      <button className="btn btn--rounded">
        {expense ? 'Update Expense' : 'Create New Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;
