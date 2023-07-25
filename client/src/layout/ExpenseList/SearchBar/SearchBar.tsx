import React, { useEffect, useState } from "react";

import { useAppSelector } from "@hooks/useAppSelector";
import useExpenseFilters from "@hooks/useExpenseFilters";
import { selectSearchText } from "@features/filters/filtersSlice";

import { StyledContainer, StyledLabel, StyledInput } from "./SearchBar.styled";
import Icon from "@components/Icon/Icon";
import Button from "@components/Button/Button";
import Modal from "@components/Modal/Modal";
import Paragraph from "@components/Text/Paragraph";
import Title from "@components/Text/Title";

const SearchBar = () => {
  const [text, setText] = useState("");
  const [showHelp, setShowHelp] = useState(false);
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
      <div>
        <StyledLabel htmlFor="search">
          <Icon name="search" />
        </StyledLabel>

        <StyledLabel>
          <Button variant="icon" onClick={() => setShowHelp(true)}>
            <Icon name="info" />
          </Button>
        </StyledLabel>
      </div>

      <StyledInput
        id="search"
        name="search"
        value={text}
        onChange={handleChange}
      />

      {showHelp && (
        <Modal title="Did You Know...?" requestClose={() => setShowHelp(false)}>
          <Paragraph>You can use this search bar to quickly find expenses, using different sets of criteria.</Paragraph>
          <Title>By Date:</Title>
          <Paragraph>Type <pre>@</pre> followed by a number to search for expenses made on that day of the month. You can also type a day of the week, for example <em>@Tuesday</em> to filter expenses that fall on day date.</Paragraph>
          <Title>By Category:</Title>
          <Paragraph>Type <pre>/</pre> followed by a category name to narrow down for expenses made on that day of the month. You can also type a day of the week, for example <em>@Tuesday</em> to filter expenses that fall on day date.</Paragraph>
          <Title>By Text:</Title>
          <Paragraph>Start typing without any prefixes to search expenses by title and description.</Paragraph>
          <Paragraph>Please, keep in mind that currently there are some limitaions to this feature. For instance, it's not possible to combine different filters such as text or date.</Paragraph>
          <Paragraph>As all data remains encrypted, only expenses for the currently selected month are considered in the search.</Paragraph>
        </Modal>
      )}
    </StyledContainer>
  );
};

export default SearchBar;
