import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';

import { useState } from 'react';
import { connect } from 'react-redux';
import { DateRangePicker } from 'react-dates';
import { setTextFilter, setStartDate, setEndDate } from '../redux/actions/filters';

export const ExpenseFilters = ({ filters, setTextFilter, setStartDate, setEndDate }) => {

  const [calendarFocused, setCalendarFocus] = useState(null);

  const onTextChange = (e) => {
    setTextFilter(e.target.value);
  };
  const onFocusChange = (calendarFocused) => setCalendarFocus(calendarFocused);
  const onDatesChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <form className="filters" onSubmit={() => {}}>
      <input
        className="filters__text"
        onChange={onTextChange}
        placeholder="Search through your expenses"
      />
      <DateRangePicker
        startDate={filters.startDate}
        startDateId="your_unique_start_date_id"
        endDate={filters.endDate}
        endDateId="your_unique_end_date_id"
        focusedInput={calendarFocused}
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
  filters: state.filters
});

const mapDispatchToProps = (dispatch) => ({
  setTextFilter: (text) => dispatch(setTextFilter(text)),
  setStartDate: (startDate) => dispatch(setStartDate(startDate)),
  setEndDate: (endDate) => dispatch(setEndDate(endDate))
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseFilters);
