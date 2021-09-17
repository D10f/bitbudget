import { useState, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { selectAmountByCategory, selectPercentageByCategory } from '../../../redux/expenses/selectors';
import { selectCurrentWalletCurrency } from '../../../redux/wallets/selectors';
import useColorScheme from '../../../hooks/useColorScheme';

import Button from '../../../components/Button';
import DoughnutChart from './DoughnutChart';

// TODO: Recalculate position on window resize event
const chartLegend = {
  display: true,
  position: window.innerWidth > 600 ? 'left' : 'top',
  // align: 'center',
  labels: {
    font: {
      family: 'Space Grotesk'
    },
    padding: 20
  }
};

const CategoriesBalance = ({ amountByCategory, percentageByCategory, currency, updateFilterList }) => {

  // An initial value, and a getter that loops through a list of available color schemes. Use it to
  // define a funciton that will update the color schemes on demand
  const [ initialScheme, getColorScheme ] = useColorScheme();

  const [ colorScheme, setColorScheme ] = useState(initialScheme);
  const [ isBtnHidden, setIsBtnHidden ] = useState(true);

  const handleChartClick = useCallback((_event, _activeElements, chart) => {
    const category = chart.tooltip.dataPoints[0].label;
    updateFilterList(`/${category}`);
  }, [updateFilterList]);


  const handleTooltipLabel = useCallback(ctx => {
    const { label, formattedValue } = ctx;
    const categoryPercentageLookup = percentageByCategory[label];
    return ` ${currency}${formattedValue} (${categoryPercentageLookup})`;
  }, [percentageByCategory, currency]);


  const handleTooltipTitle = useCallback(ctx => {
    return ctx[0].label;
  }, []);

  const memoizedLabels = useMemo(() => Object.keys(amountByCategory), [amountByCategory]);
  const memoizedValues = useMemo(() => Object.values(amountByCategory), [amountByCategory]);

  return (
    <section
      className="dashboard__balance--categories is-relative"
      onMouseOver={() => setIsBtnHidden(false)}
      onMouseLeave={() => setIsBtnHidden(true)}
    >

      <Button
        className={`btn--hollow is-floating ${isBtnHidden ? "is-phantom" : ""}`}
        onClick={() => setColorScheme(getColorScheme())}
        text="Toggle Scheme"
      />

      <DoughnutChart
        labels={memoizedLabels}
        data={memoizedValues}
        onClick={handleChartClick}
        tooltipLabel={handleTooltipLabel}
        tooltipTitle={handleTooltipTitle}
        backgroundColor={colorScheme}
        borderColor={colorScheme}
        legend={chartLegend}
      />

    </section>
  );
};

const mapStateToProps = state => ({
  amountByCategory: selectAmountByCategory(state),
  percentageByCategory: selectPercentageByCategory(state),
  currency: selectCurrentWalletCurrency(state)
});

export default connect(mapStateToProps)(CategoriesBalance);
