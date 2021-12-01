import React from 'react';
import styled from 'styled-components';

interface IRowProps {
  children: React.ReactChild | React.ReactChild[];
}

const StyledRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
`;

const Row = ({ children }: IRowProps) => {
  return (
    <StyledRow>
      {children}
    </StyledRow>
  );
};

export default Row;