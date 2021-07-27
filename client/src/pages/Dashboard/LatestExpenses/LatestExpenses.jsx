import { useState, useEffect, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import useFilterExpenses from '../../../hooks/useFilterExpenses';

import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';
import ExpenseItem from './ExpenseItem';
import ExpenseMonthPicker from './ExpenseMonthPicker';

const LatestExpenses = ({ expenses, filters }) => {

  const [ text, setText ] = useState(filters);
  const [ expensesInView, setExpensesInView ] = useState([]);
  const filterExpenses = useFilterExpenses(expenses);

  // Updates the expenses when user click on category chart (check ../index.jsx)
  useEffect(() => {
    setText(filters);
    setExpensesInView(filterExpenses(filters));
  }, [filters]);

  // Updates the expenses when user types in something in the input
  useEffect(() => setExpensesInView(filterExpenses(text)), [expenses]);

  // Sorts the expenses by their createdAt value
  const sortByDateDesc = (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt);
  const sortByDateAsc = (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt);

  const handleChange = e => {
    setText(e.target.value);
    setExpensesInView(filterExpenses(e.target.value));
  };

  return (
    <ul className="expenses">
      <li className="expenses__header">
        <ExpenseMonthPicker />
        <TextInput
          modifiers="is-fullwidth"
          value={text}
          name="text"
          placeholder="Type something to search through your expenses"
          onChange={handleChange}
        />

        <Link
          className="btn is-fullwidth has-text-center"
          to="/add-expense"
        >
          Add New Expense
        </Link>
      </li>
      {
        expensesInView
          .sort(sortByDateDesc)
          .map(expense => <ExpenseItem key={expense.id} expense={expense} />)
      }
    </ul>
  );
};

const mapStateToProps = state => ({
  searchTerm: state.filters.search
});

export default connect(mapStateToProps)(LatestExpenses);
