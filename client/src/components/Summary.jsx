import { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { sortExpenses, switchSortOrder } from '../redux/actions/filters';
import {
  selectCurrentWalletExpenses,
  selectCurrentMonthExpenses,
  selectLastMonthExpenses,
  selectCategoryCount
} from '../redux/selectors/expenses';

import ExpenseList from './ExpenseList';
import GraphDoughnut from './GraphDoughnut';

const Summary = ({
  expenses,
  currentMonthExpenses,
  lastMonthExpenses,
  categoryCount,
  sortBy,
  sortDesc,
  switchSortOrder,
  sortExpenses,
  currency
}) => {

  const [viewAmount, setViewAmount] = useState(5);
  const [latest, setLatest] = useState(expenses.slice(Math.max(0, expenses.length - viewAmount)));

  const latestTotalAmount = useCallback(() => {
    return latest.map(expense => expense.amount / 100);
  }, latest);

  const latestLabels = useCallback(() => {
    return latest.map(expense => `${expense.title}`);
  }, latest);

  const latestExpensesTitle = `Last ${viewAmount} Expenses.`

  return (
    <section className="summaries">
      <div className="summary">
        <h3 className="summary__title">{latestExpensesTitle}</h3>
        <ExpenseList expenses={latest} />
        <GraphDoughnut
          data={latestTotalAmount()}
          labels={latestLabels()}
          title={latestExpensesTitle}
        />
      </div>
      <div className="summary">
        <h3 className="summary__title">This Month</h3>
        <GraphDoughnut
          data={categoryCount}
          labels={expenses.map(expense => `${expense.category}`)}
        />
      </div>
    </section>
  );
};


//
// <h3 className="summary__title">Last Month</h3>
// <div className="summary">
//   <ExpenseList expenses={lastMonthExpenses} />
//   <GraphDoughnut expenses={lastMonthExpenses} />
// </div>

const mapStateToProps = (state) => ({
  expenses: selectCurrentWalletExpenses(state),
  categoryCount: selectCategoryCount(state),
  currentMonthExpenses: selectCurrentMonthExpenses(state),
  lastMonthExpenses: selectLastMonthExpenses(state),
  sortBy: state.filters.sortBy,
  sortDesc: state.filters.sortDesc,
  currency: state.wallets.currency
});

const mapDispatchToProps = (dispatch) => ({
  sortExpenses: (value) => dispatch(sortExpenses(value)),
  switchSortOrder: () => dispatch(switchSortOrder())
});

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
