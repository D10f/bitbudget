import React from 'react';
import styled from 'styled-components';

interface IMonthSummary {
  currentWallet: IWallet;
  currentMMYY: string;
}

const Container = styled.section`
  grid-area: graphs;
`;

const MonthSummary = ({}: IMonthSummary) => {
  return (
    <Container>
      <h1>Graphs</h1>
    </Container>
  );
};

export default MonthSummary;