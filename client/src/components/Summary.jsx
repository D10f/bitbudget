import { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { formatAsCurrency } from '../utils/expenses';
import { selectAmountByCategory } from '../redux/selectors/expenses';

import ExpenseList from './ExpenseList';
import ChartDoughnut from './ChartDoughnut';
import ChartLine from './ChartLine';

const Summary = ({ expenses, categoryAmounts, sortBy, sortDesc, currency }) => {

  return (
    <section className="summaries">
      <div className="summary">
        <h3 className="summary__title">Summary Title</h3>
      </div>
      <div className="summary">
        <h3 className="summary__title">Summary Title</h3>
      </div>
      <div className="summary">
        <h3 className="summary__title">Summary Title</h3>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  expenses: state.expenses,
  categoryAmounts: selectAmountByCategory(state),
  sortBy: state.filters.sortBy,
  sortDesc: state.filters.sortDesc,
  currency: state.wallets.currency
});

export default connect(mapStateToProps)(Summary);
