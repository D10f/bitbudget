// import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectSortedExpenses} from '../redux/selectors/expenses';
import { sortExpenses, switchSortOrder } from '../redux/actions/filters';
import ExpenseFilters from '../components/ExpenseFilters';
import ExpenseList from '../components/ExpenseList';

const ExpensePage = ({ expenses, sortBy, sortDesc, sortExpenses, switchSortOrder}) => {

  const handleSort = (e) => {
    const newSortValue = e.target.id;

    if (newSortValue === sortBy) {
      switchSortOrder();
    }

    sortExpenses(newSortValue);
  };
  // <Link to="/add-expense" className="expense-page__addbtn">+</Link>

  return (
    <section className="expense">
      <ExpenseFilters />
      {
        expenses.length
        ? (<>
            <ExpenseList expenses={expenses} sortBy={sortBy} sortDesc={sortDesc} handleSort={handleSort} />
            <Link to="/add-expense" className="btn btn--action mt2 is-center">Add Expense</Link>
           </>)
        : (<>
            <p className="expense__empty">There are no expenses yet</p>
            <Link to="/add-expense" className="btn btn--action">Add Your First Expense</Link>
           </>)
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
