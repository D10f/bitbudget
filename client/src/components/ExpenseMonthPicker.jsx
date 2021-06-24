import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { setCurrentMonth } from '../redux/actions/filters';

export const ExpenseMonthPicker = ({ currentMonth, setCurrentMonth }) => {

  const [month, setMonth] = useState(currentMonth.month);
  const [year, setYear] = useState(currentMonth.year);
  const [timer, setTimer] = useState(undefined);

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

  }, [month]);

  const changeYear = byAmount => setYear(year + byAmount);

  return (
    <aside className="filters__picker mb2">
      <div className="filters__picker--month">{moment().month(month).format('MMMM')}</div>
      <div className="filters__picker--year mr2">{moment().year(year).format('YYYY')}</div>
      <button
        className="filters__picker--btn"
        onClick={decreaseMonth}
      >
        &larr;
      </button>
      <button
        className="filters__picker--btn"
        onClick={increaseMonth}
      >
        &rarr;
      </button>
    </aside>
  );
};

const mapStateToProps = state => ({
  currentMonth: state.filters.currentMonth
});

const mapDispatchToProps = dispatch => ({
  setCurrentMonth: month => dispatch(setCurrentMonth(month))
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseMonthPicker);
