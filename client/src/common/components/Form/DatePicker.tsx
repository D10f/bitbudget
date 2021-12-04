import React, { useState } from "react";
import styled from "styled-components";
import { SingleDatePicker } from "react-dates";
import moment from "moment";
import Icon from "../Icon/Icon";

interface IDatePickerProps {
  value: string;
  onChange: (...event: any[]) => void; // as provided by react-hook-form
  name: string;
  label: string;
  hideLabel?: boolean;
  error?: boolean;
}

interface IStyledLabelProps {
  hide?: boolean;
}

interface IStyledWrapperProps {
  error?: boolean;
}

const StyledLabel = styled.label<IStyledLabelProps>`
  visibility: ${({ hide }) => (hide ? "hidden" : "visible")};
  height: ${({ hide }) => (hide ? "0px" : "auto")};
  margin-bottom: 1rem;
`;

const StyledInputWrapper = styled.div<IStyledWrapperProps>`
  border: 1px solid
    ${({ theme, error }) => (error ? theme.colors.error : theme.colors.light.default)};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.dark.default};
  min-width: 30rem;
  margin-bottom: 1rem;
`;

const StyledIcon = styled(Icon)`
  position: absolute;
  top: 4.7rem;
  right: 1.6rem;
  width: 1.6rem;
  height: 1.6rem;
  fill: ${({ theme }) => theme.colors.error};
`;

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
              // let d = selectedDate?.format('YYYY-MM-DD');
              // let f = moment(d).format('dddd, MMMM Do');
              onChange(selectedDate?.toString());
              setCreatedAt(selectedDate);
            }}
            focused={dateFocus}
            onFocusChange={({ focused }) => setDateFocus(focused)}
            noBorder={true}
          />
          {error && <StyledIcon name="warning" />}
        </StyledInputWrapper>
      </>
    );
  }
);

export default DatePicker;
