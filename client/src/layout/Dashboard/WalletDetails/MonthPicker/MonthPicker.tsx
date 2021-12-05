import React, { useState } from 'react';
import styled from 'styled-components';
import Row from '../../../../common/components/Row/Row';

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

  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(2021);

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

  const translateMonth = (n: number) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[n];
  };

  return (
    <Row marginless>
      <StyledTimeTag datetime={`${month}-${year}`}>{translateMonth(month)}</StyledTimeTag>
      <StyledTimeTag datetime={`${month}-${year}`}>{year}</StyledTimeTag>
      <Row marginless gap={2}>
        <StyledButton onClick={decreaseMonth}>&larr;</StyledButton>
        <StyledButton onClick={increaseMonth}>&rarr;</StyledButton>
      </Row>
    </Row>
  );
};

export default MonthPicker;