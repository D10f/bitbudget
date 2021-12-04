import React, { useState } from 'react';
import styled from 'styled-components';
import Icon from '../../../common/components/Icon/Icon';

const StyledContainer = styled.aside`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 2px solid ${({ theme }) => theme.colors.dark.darkest};;
`;

const StyledLabel = styled.label`
  padding: 0 1rem;
  svg {
    width: 2rem;
    height: 2rem;
    fill: ${({ theme }) => theme.colors.light.darker};
  }
`;

const StyledInput = styled.input`
  width: 100%;
  background: none;
  color: inherit;
  font-size: 2rem;
  padding: 1rem;
  border: none;
`;

const SearchBar = () => {

  const [text, setText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    // TODO: create filter function and update expense list
  };

  return (
    <StyledContainer>
      <StyledLabel htmlFor="search">
        <Icon name="search" />
      </StyledLabel>
      <StyledInput id="search" name="search" value={text} onChange={handleChange} />
    </StyledContainer>
  );
};

export default SearchBar;