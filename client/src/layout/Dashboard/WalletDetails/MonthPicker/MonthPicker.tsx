import React from "react";
import styled from "styled-components";
import { useMonthPicker } from "@hooks/useMonthPicker";
import { months } from '@constants';
import Row from "@components/Row/Row";

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
