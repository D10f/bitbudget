import React from 'react';
import styled from 'styled-components';

import { useAppSelector } from '../../../common/hooks/useAppSelector';
import { selectCurrentExpenses } from '../../../features/expenses/expensesSlice';

import ExpenseSummary from './ExpenseSummary/ExpenseSummary';

const Container = styled.section`
  grid-area: graphs;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;

const MonthSummary = () => {

  const expenses = useAppSelector(selectCurrentExpenses);
  
  return (
    <Container>
      <ExpenseSummary expenses={expenses} />
    </Container>
  );
};

export default MonthSummary;