import { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import ExpenseList from './ExpenseList';
import { sortExpenses, switchSortOrder } from '../redux/actions/filters';
import { selectSortedExpenses } from '../redux/selectors/expenses';

const Summary = ({ expenses, sortBy, sortDesc, switchSortOrder, sortExpenses }) => {

  const [viewAmount, setViewAmount] = useState(5);
  const [latest, setLatest] = useState(expenses.slice(expenses.length - viewAmount));

  const handleSort = useCallback((e) => {
    const newSortValue = e.target.id;

    if (newSortValue === sortBy) {
      switchSortOrder();
    }

    sortExpenses(newSortValue);
  }, [sortExpenses]);

  return (
    <>
      <h3 className="summary__title">Last {viewAmount} Expenses</h3>
      <div className="summary">
        <ExpenseList expenses={expenses} />
        <article className="summary__graph"></article>
      </div>

      <h3 className="summary__title">This Month</h3>
      <div className="summary">
        <ExpenseList expenses={expenses} />
        <article className="summary__graph"></article>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  expenses: selectSortedExpenses(state),
  sortBy: state.filters.sortBy,
  sortDesc: state.filters.sortDesc
});

const mapDispatchToProps = (dispatch) => ({
  sortExpenses: (value) => dispatch(sortExpenses(value)),
  switchSortOrder: () => dispatch(switchSortOrder())
});

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
