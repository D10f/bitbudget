import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";

import { useAppSelector } from "@hooks/useAppSelector";
import useExpenseFilters from "@hooks/useExpenseFilters";
import { selectCurrentWallet } from "@features/wallets/walletsSlice";

import ExpenseItem from "../ExpenseItem/ExpenseItem";
import SearchBar from "../SearchBar/SearchBar";
import { StyledContainer, StyledList } from './ExpenseList.styled';

const ExpenseList = () => {
  const currentWallet = useAppSelector(selectCurrentWallet);
  const [subMenuOpen, setSubMenuOpen] = useState<string | null>(null);
  const { filteredExpenses } = useExpenseFilters();

  const showExpenseList = () =>
    filteredExpenses.map((expense) => (
      <ExpenseItem
        key={expense.id}
        expense={expense}
        wallet={currentWallet!}
        subMenuOpen={subMenuOpen}
        setSubMenuOpen={setSubMenuOpen}
      />
    ));

  const showEmptyList = () => <p>No Expenses For This Period</p>;

  return (
    <StyledContainer tabIndex={-1}>
      <StyledList>
        <SearchBar />
        <AnimatePresence>
          {filteredExpenses.length > 0 ? showExpenseList() : showEmptyList()}
        </AnimatePresence>
      </StyledList>
    </StyledContainer>
  );
};

export default ExpenseList;
