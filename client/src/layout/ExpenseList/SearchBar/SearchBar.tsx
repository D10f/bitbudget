import React, { useEffect, useState } from "react";

import { useAppSelector } from "@hooks/useAppSelector";
import useExpenseFilters from "@hooks/useExpenseFilters";
import { selectSearchText } from "@features/filters/filtersSlice";

import Icon from "@components/Icon/Icon";
import { StyledContainer, StyledLabel, StyledInput } from "./SearchBar.styled";

const SearchBar = () => {
  const [text, setText] = useState("");
  const searchText = useAppSelector(selectSearchText);
  const { updateSearchTerm } = useExpenseFilters();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    updateSearchTerm(e.target.value);
  };

  useEffect(() => {
    setText(searchText);
  }, [searchText]);

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
