import React, { useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../common/hooks/useAppSelector";
import { selectCurrentExpenses } from "../../features/expenses/expensesSlice";
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
  padding-bottom: 2rem;
  /* max-width: 35rem; */
`;

const ExpenseList = () => {
  const [subMenuOpen, setSubMenuOpen] = useState<string | null>(null);
  const expenses = useAppSelector(selectCurrentExpenses);
  const currentWallet = useAppSelector((state) =>
    state.wallets.wallets.find((w) => w.isCurrent)
  );

  return (
    <StyledContainer tabIndex={-1}>
      <StyledList>
        <SearchBar />
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              wallet={currentWallet!}
              subMenuOpen={subMenuOpen}
              setSubMenuOpen={setSubMenuOpen}
            />
          ))
        ) : (
          <p>No Expenses To Show</p>
        )}
      </StyledList>
    </StyledContainer>
  );
};

export default ExpenseList;
