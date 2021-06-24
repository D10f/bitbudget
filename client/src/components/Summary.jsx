import { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { formatAsCurrency } from '../utils/expenses';
import moment from 'moment';
import { sortExpenses, switchSortOrder } from '../redux/actions/filters';
import {
  selectCurrentWalletExpenses,
  selectCurrentMonthExpenses,
  selectLastMonthExpenses,
  selectCategoryCount
} from '../redux/selectors/expenses';

import ExpenseList from './ExpenseList';
import ChartDoughnut from './ChartDoughnut';
import ChartLine from './ChartLine';

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

  const topExpensesTitle = `Top ${viewAmount} Expenses.`
  const topCategoriesTitle = `Top ${viewAmount} Categories.`

  const daysInCurrentMonth = () => {
    const days = new Array(moment().daysInMonth());
    for (let i = 0; i < days.length; i++) {
      days[i] = i + 1;
    }
    return days;
  }

  const expensedata = currentMonthExpenses.map(expense => expense.amount);

  return (
    <section className="summaries">
      <div className="summary">
        <h3 className="summary__title">{topExpensesTitle}</h3>
        <ExpenseList expenses={latest} />
        <ChartDoughnut
          data={latestTotalAmount()}
          labels={latestLabels()}
          title={topExpensesTitle}
        />
      </div>
      <div className="summary">
        <h3 className="summary__title">{topCategoriesTitle}</h3>
        <ChartDoughnut
          data={latestTotalAmount()}
          labels={latestLabels()}
          title={topCategoriesTitle}
        />
      </div>
      <div className="summary">
        <ChartDoughnut
          data={expensedata}
          labels={expensedata.map(expense => expense.title)}
          title="Test"
        />
      </div>
    </section>
  );
};


//
// <h3 className="summary__title">Last Month</h3>
// <div className="summary">
//   <ExpenseList expenses={lastMonthExpenses} />
//   <ChartDoughnut expenses={lastMonthExpenses} />
// </div>

// <ChartLine
//   data={expensedata}
//   labels={daysInCurrentMonth()}
//   title="This month"
// />

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
