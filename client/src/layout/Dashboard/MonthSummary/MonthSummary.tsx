import React from 'react';
import styled from 'styled-components';

const Container = styled.section`
  grid-area: graphs;
`;

const MonthSummary = () => {
  return (
    <Container>
      <h1>Graphs</h1>
    </Container>
  );
};

export default MonthSummary;