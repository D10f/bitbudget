import { useState } from 'react';
import { connect } from 'react-redux';
import { sortExpenses, switchSortOrder } from '../redux/actions/filters';
import {
  selectCurrentWalletExpenses,
  selectCurrentMonthExpenses,
  selectLastMonthExpenses
} from '../redux/selectors/expenses';

import ExpenseList from './ExpenseList';
import Graph from './Graph';

const Summary = ({
  expenses,
  currentMonthExpenses,
  lastMonthExpenses,
  sortBy,
  sortDesc,
  switchSortOrder,
  sortExpenses
}) => {

  const [viewAmount, setViewAmount] = useState(5);
  const [latest, setLatest] = useState(expenses.slice(expenses.length - viewAmount));

  console.log('Summary rendering');

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
    <>
      <h3 className="summary__title">Last {viewAmount} Expenses</h3>
      <div className="summary">
        <ExpenseList expenses={expenses} />
        <Graph expenses={expenses} />
      </div>

      <h3 className="summary__title">This Month</h3>
      <div className="summary">
        <ExpenseList expenses={currentMonthExpenses} />
        <Graph expenses={currentMonthExpenses} />
      </div>

      <h3 className="summary__title">Last Month</h3>
      <div className="summary">
        <ExpenseList expenses={lastMonthExpenses} />
        <Graph expenses={lastMonthExpenses} />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  expenses: selectCurrentWalletExpenses(state),
  currentMonthExpenses: selectCurrentMonthExpenses(state),
  lastMonthExpenses: selectLastMonthExpenses(state),
  sortBy: state.filters.sortBy,
  sortDesc: state.filters.sortDesc
});

const mapDispatchToProps = (dispatch) => ({
  sortExpenses: (value) => dispatch(sortExpenses(value)),
  switchSortOrder: () => dispatch(switchSortOrder())
});

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
