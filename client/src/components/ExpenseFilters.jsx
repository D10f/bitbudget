import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import { setTextFilter, setStartDate, setEndDate } from '../redux/actions/filters';

export const ExpenseFilters = ({
  setTextFilter,
  setStartDate,
  setEndDate,
  startDate,
  endDate
}) => {

  const [calendarFocus, setCalendarFocus] = useState(null);

  const onTextChange = (e) => setTextFilter(e.target.value);
  const onFocusChange = (calendarFocus) => setCalendarFocus(calendarFocus);
  const onDatesChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  useEffect(() => {
    return () => {
      setTextFilter('');
      setStartDate(null);
      setEndDate(null);
    };
  }, []);

  return (
    <form className="filters" onSubmit={() => {}}>
      <input
        className="filters__text"
        onChange={onTextChange}
        placeholder="Search through your expenses"
      />
      <DateRangePicker
        startDate={startDate}
        startDateId="your_unique_start_date_id"
        endDate={endDate}
        endDateId="your_unique_end_date_id"
        focusedInput={calendarFocus}
        onFocusChange={onFocusChange}
        onDatesChange={onDatesChange}
        numberOfMonths={1}
        isOutsideRange={() => false}
        showClearDates={true}
        displayFormat="DD/MM/YYYY"
      />
    </form>
  );
};

const mapStateToProps = (state) => ({
  startDate: state.filters.startDate,
  endDate: state.filters.endDate
});

const mapDispatchToProps = (dispatch) => ({
  setTextFilter: (text) => dispatch(setTextFilter(text)),
  setStartDate: (startDate) => dispatch(setStartDate(startDate)),
  setEndDate: (endDate) => dispatch(setEndDate(endDate))
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseFilters);
