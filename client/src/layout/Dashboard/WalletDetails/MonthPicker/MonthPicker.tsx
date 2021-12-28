import React, { useState } from "react";
import styled from "styled-components";
import Row from "../../../../common/components/Row/Row";
import { useAppDispatch } from "../../../../common/hooks/useAppDispatch";
import { useAppSelector } from "../../../../common/hooks/useAppSelector";
import { useMonthPicker } from "../../../../common/hooks/useMonthPicker";
import { selectFilters } from "../../../../features/filters/filtersSlice";

interface ITimeTag {
  datetime: string;
}

const StyledTimeTag = styled.time<ITimeTag>`
  font-size: 2rem;
`;

const StyledButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.light.default};
  font-size: 2rem;

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.primary.default};
  }
`;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MonthPicker = () => {
  const { month, year, decreaseMonth, increaseMonth } = useMonthPicker();

  const translateMonth = (n: number) => {
    return months[n];
  };

  return (
    <Row marginless>
      <StyledTimeTag datetime={`${month}-${year}`}>
        {translateMonth(month)}
      </StyledTimeTag>
      <StyledTimeTag datetime={`${month}-${year}`}>{year}</StyledTimeTag>
      <Row marginless gap={2}>
        <StyledButton onClick={decreaseMonth}>&larr;</StyledButton>
        <StyledButton onClick={increaseMonth}>&rarr;</StyledButton>
      </Row>
    </Row>
  );
};

export default MonthPicker;

/*
const dispatch = useAppDispatch();
  const { currentMonth, currentYear } = useAppSelector(selectFilters);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

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
*/
