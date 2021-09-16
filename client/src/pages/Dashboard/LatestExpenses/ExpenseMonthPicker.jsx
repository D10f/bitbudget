import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { setCurrentMonth } from '../../../redux/filters/actions';

export const ExpenseMonthPicker = ({ currentMonth, currentYear, setCurrentMonth }) => {

  const [timer, setTimer] = useState(undefined);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const firstRender = useRef(true);

  const decreaseMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const increaseMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  useEffect(() => {

    // Small hack to prevent firing this fn when component mounts (first render)
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    clearTimeout(timer);

    // debounce redux update to avoid unnecessary computations
    setTimer(setTimeout(() => {
      setCurrentMonth({ year, month });
    }, 1000));

  }, [month, setTimer, setCurrentMonth]);

  const changeYear = byAmount => setYear(year + byAmount);

  return (
    <aside className="filters__picker">
      <div className="filters__picker--month">{moment({ month }).format('MMMM')}</div>
      <div className="filters__picker--year">{moment({ year }).format('YYYY')}</div>
      <button
        className="filters__picker--btn is-right"
        onClick={decreaseMonth}
      >
        &larr;
      </button>
      <button
        className="filters__picker--btn has-text-right"
        onClick={increaseMonth}
      >
        &rarr;
      </button>
    </aside>
  );
};

const mapStateToProps = state => ({
  currentMonth: state.filters.month,
  currentYear: state.filters.year
});

const mapDispatchToProps = dispatch => ({
  setCurrentMonth: month => dispatch(setCurrentMonth(month))
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseMonthPicker);
