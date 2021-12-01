import React from 'react';
import styled from 'styled-components';

interface IFormControlProps {
  children: React.ReactChild | React.ReactChild[];
}

const StyledControl = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
`;

const FormControl = ({ children }: IFormControlProps) => {
  return (
    <StyledControl aria-hidden="true">
      {children}
    </StyledControl>
  );
};

export default FormControl;