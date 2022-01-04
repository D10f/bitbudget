import React, { useState } from "react";
import { SingleDatePicker } from "react-dates";
import moment from "moment";
import { StyledLabel, StyledIcon, StyledInputWrapper } from './DatePicker.styled';

interface IDatePickerProps {
  value: string;
  onChange: (...event: any[]) => void; // as provided by react-hook-form
  name: string;
  label: string;
  hideLabel?: boolean;
  error?: boolean;
}

const DatePicker = React.forwardRef(
  (
    {
      value,
      onChange,
      name,
      label,
      hideLabel = false,
      error = false,
    }: IDatePickerProps,
    ref
  ) => {
    const [createdAt, setCreatedAt] = useState<moment.Moment | null>(
      value ? moment(value) : null
    );
    const [dateFocus, setDateFocus] = useState(false);

    return (
      <>
        <StyledLabel htmlFor={name} hide={hideLabel}>
          {label}
        </StyledLabel>
        <StyledInputWrapper error={error}>
          <SingleDatePicker
            id="Expense Date"
            numberOfMonths={1}
            isOutsideRange={() => false}
            displayFormat="DD/MM/YYYY"
            date={createdAt}
            onDateChange={(selectedDate) => {
              onChange(selectedDate?.toString());
              setCreatedAt(selectedDate);
            }}
            focused={dateFocus}
            onFocusChange={({ focused }) => setDateFocus(focused)}
            noBorder={true}
          />
          {error && <StyledIcon name="error" />}
        </StyledInputWrapper>
      </>
    );
  }
);

export default DatePicker;
