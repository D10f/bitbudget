import React, { useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../common/hooks/useAppSelector";
import ExpenseItem from "./ExpenseItem/ExpenseItem";

const StyledContainer = styled.aside`
  grid-area: expenses;
  /* height: 94vh; */
  overflow-y: auto;
  overflow-x: hidden;
`;

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  max-width: 40rem;
`;

const ExpenseList = () => {
  const [subMenuOpen, setSubMenuOpen] = useState<string | null>(null);
  const expenses = useAppSelector((state) => state.expenses.expenses);
  const currentWallet = useAppSelector((state) =>
    state.wallets.wallets.find((w) => w.isCurrent)
  );

  return (
    <StyledContainer tabIndex={-1}>
      <StyledList>
        {expenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            wallet={currentWallet!}
            subMenuOpen={subMenuOpen}
            setSubMenuOpen={setSubMenuOpen}
          />
        ))}
      </StyledList>
    </StyledContainer>
  );
};

export default ExpenseList;
