// import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectSortedExpenses} from '../redux/selectors/expenses';
import { sortExpenses, switchSortOrder } from '../redux/actions/filters';
import ExpenseFilters from '../components/ExpenseFilters';
import ExpenseList from '../components/ExpenseList';

const ExpensePage = ({ expenses, sortBy, sortDesc, sortExpenses, switchSortOrder}) => {

  console.log('expense page rendering');

  const handleSort = (e) => {
    const newSortValue = e.target.id;

    if (newSortValue === sortBy) {
      switchSortOrder();
    }

    sortExpenses(newSortValue);
  };

  // const handleSort = useCallback((e) => {
  //   const newSortValue = e.target.id;
  //
  //   if (newSortValue === sortBy) {
  //     switchSortOrder();
  //   }
  //
  //   sortExpenses(newSortValue);
  // }, [sortExpenses]);

  return (
    <section className="expense">
      <Link to="/add-expense" className="expense-page__addbtn">+</Link>
      <ExpenseFilters />
      {
        expenses.length
        ? <ExpenseList expenses={expenses} sortBy={sortBy} sortDesc={sortDesc} handleSort={handleSort} />
        : <p className="expense__empty">There are no expenses yet</p>
      }
    </section>
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

export default connect(mapStateToProps, mapDispatchToProps)(ExpensePage);
// <ExpenseFilters />
