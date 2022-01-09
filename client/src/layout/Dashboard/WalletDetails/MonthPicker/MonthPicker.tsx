import React from "react";
import { useMonthPicker } from "@hooks/useMonthPicker";
import { months } from '@constants';
import Row from "@components/Row/Row";
import { StyledTimeTag, StyledButton } from './MonthPicker.styled';

const MonthPicker = () => {
  const { month, year, decreaseMonth, increaseMonth } = useMonthPicker();

  return (
    <Row marginless>
      <StyledTimeTag datetime={`${month}-${year}`}>
        {months[month]}
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
