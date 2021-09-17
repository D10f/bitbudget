import React, { useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import { formatAsCurrency } from '../../../utils/expenses';
import { selectAmountByCategory, selectAmountByDay, selectPercentageByDay } from '../../../redux/expenses/selectors';
import { selectLabeledDaysInMonth } from '../../../redux/filters/selectors';
import { selectCurrentWalletCurrency } from '../../../redux/wallets/selectors';

import BarChart from './BarChart';

const MonthSummary = ({
  labelsForCurrentMonth,
  amountByDay,
  percentByDay,
  currency,
  updateFilterList
}) => {

  const handleChartClick = useCallback((_event, _activeElements, chart) => {
    const date = chart.tooltip.dataPoints[0].label;
    const day = date.slice(0, 2);
    updateFilterList(`@${day}`);
  }, [updateFilterList]);

  const handleTooltipLabel = useCallback(ctx => {
    const { label, formattedValue } = ctx;
    const percentByDayLookup = percentByDay[label];
    return ` ${currency}${formattedValue} (${percentByDayLookup})`;
  }, []);

  const bgColor = useMemo(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--primary');
  });

  const scaleX = {
    grid: {
      display: false
    },
    stacked: true
  };

  const scaleY = {
    beginAtZero: true,
    stacked: true,
    ticks: {
      callback: (value) => currency + value
    }
  };

  const expenseDataset = {
    data: amountByDay[0],
    backgroundColor: bgColor,
    borderColor: bgColor,
    borderWidth: "1"
  };

  const incomeDataset = {
    data: amountByDay[1],
    backgroundColor: '#f9b058',
    borderColor: '#f9b058',
    borderWidth: "1"
  };

  return (
    <section className="dashboard__monthly-expenses">
      <BarChart
        labels={labelsForCurrentMonth}
        onClick={handleChartClick}
        datasets={[ expenseDataset, incomeDataset ]}
        usePointStyle={false}
        tooltipLabel={handleTooltipLabel}
        base="0"
        legend={{ display: false }}
        scaleX={scaleX}
        scaleY={scaleY}
      />
    </section>
  );
};

const mapStateToProps = state => ({
  amountByDay: selectAmountByDay(state),
  percentByDay: selectPercentageByDay(state),
  currency: selectCurrentWalletCurrency(state),
  labelsForCurrentMonth: selectLabeledDaysInMonth(state)
});

export default connect(mapStateToProps)(React.memo(MonthSummary));


/*
<BarChart
  labels={labelsForCurrentMonth}
  onClick={handleChartClick}
  data={amountByDay}
  usePointStyle={false}
  tooltipLabel={handleTooltipLabel}
  backgroundColor={bgColor}
  borderColor={bgColor}
  borderWidth="1"
  base="0"
  legend={{ display: false }}
  scaleX={scaleX}
  scaleY={scaleY}
/>
*/
