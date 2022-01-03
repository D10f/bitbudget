import React, { useState } from "react";
import styled from "styled-components";
import Icon from "../../../common/components/Icon/Icon";

interface ISearchBar {
  setTextFilter: (term: string) => void;
}

const StyledContainer = styled.aside`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 90%;
  border-bottom: 2px solid ${({ theme }) => theme.colors.dark.darkest}; ;
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
  display: inline-block;
  background: none;
  color: inherit;
  font-size: 1.6rem;
  padding: 1rem;
  border: none;
`;

const SearchBar = ({ setTextFilter }: ISearchBar) => {
  const [text, setText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    setTextFilter(e.target.value);
  };

  return (
    <StyledContainer>
      <StyledLabel htmlFor="search">
        <Icon name="search" />
      </StyledLabel>
      <StyledInput
        id="search"
        name="search"
        value={text}
        onChange={handleChange}
      />
    </StyledContainer>
  );
};

export default SearchBar;
