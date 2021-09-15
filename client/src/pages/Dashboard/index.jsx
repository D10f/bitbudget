import { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { selectCurrentExpenses } from '../../redux/expenses/selectors';
import { selectCurrentMMYY } from '../../redux/filters/selectors';
import { startGetExpenses } from '../../redux/expenses/actions';

import Spinner from '../../components/Spinner';
import LatestExpenses from './LatestExpenses/LatestExpenses';
import Balance from './Balance/Balance';
import CategoriesBalance from './CategoriesBalance/CategoriesBalance';
import MonthSummary from './MonthSummary/MonthSummary';

const Dashboard = ({ expenses, isLoading, getExpenses, currentMMYY }) => {

  // Note this is used only to update <LatestExpenses /> from other components in this same tree
  const [ filterText, setFilterText ] = useState('');

  // Shared with <CategoriesBalance />
  const updateFilterList = useCallback(searchTerm => setFilterText(searchTerm), [setFilterText]);

  useEffect(() => getExpenses(), [ currentMMYY ]);

  return (
    <section className="dashboard">
      {isLoading ? <Spinner className="large dark centered" /> : (
        <>
          <div className="dashboard__expenses">
            <LatestExpenses expenses={expenses} filters={filterText} />
          </div>
          <div className="dashboard__graphics">
            <Balance />
            <CategoriesBalance updateFilterList={updateFilterList} />
            <MonthSummary updateFilterList={updateFilterList} />
          </div>
        </>
      )}
    </section>
  );
};

const mapStateToProps = state => ({
  expenses: selectCurrentExpenses(state),
  isLoading: state.expenses.isLoading,
  currentMMYY: selectCurrentMMYY(state)
});

const mapDispatchToProps = dispatch => ({
  getExpenses: () => dispatch(startGetExpenses())
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
