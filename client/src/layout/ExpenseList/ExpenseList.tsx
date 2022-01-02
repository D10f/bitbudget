import React, { useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../common/hooks/useAppSelector";
import { selectCurrentExpenses } from "../../features/expenses/expensesSlice";
import { selectCurrentWallet } from "../../features/wallets/walletsSlice";
import ExpenseItem from "./ExpenseItem/ExpenseItem";
import SearchBar from "./SearchBar/SearchBar";

const StyledContainer = styled.aside`
  grid-area: expenses;
  overflow-y: auto;
  overflow-x: overlay;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-right: 2rem;
  margin-left: 1rem;
  padding-bottom: 2rem;
  /* max-width: 35rem; */
`;

const ExpenseList = () => {
  const [subMenuOpen, setSubMenuOpen] = useState<string | null>(null);
  const expenses = useAppSelector(selectCurrentExpenses);
  const currentWallet = useAppSelector(selectCurrentWallet);

  const showExpenseList = () =>
    expenses.map((expense) => (
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
        {expenses.length > 0 ? showExpenseList() : showEmptyList()}
      </StyledList>
    </StyledContainer>
  );
};

export default ExpenseList;
