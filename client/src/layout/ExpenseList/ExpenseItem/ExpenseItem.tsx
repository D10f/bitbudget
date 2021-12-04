import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { useAppSelector } from "../../../common/hooks/useAppSelector";
import Modal from "../../../common/components/Modal/Modal";
import ExpenseForm from "../../../common/components/ExpenseForm/ExpenseForm";
import { AnimatePresence } from "framer-motion";
import { BooleanSchema } from "joi";
import ExpenseSubMenu from "../ExpenseSubMenu/ExpenseSubMenu";

interface IExpenseItemProps {
  expense: IExpense;
  wallet: IWallet;
  subMenuOpen: string | null;
  setSubMenuOpen: React.Dispatch<React.SetStateAction<string | null>>;
}

interface IExpenseDateStyleProps {
  datetime: string;
}

const ExpenseCard = styled.article`
  position: relative;
  width: 35rem;
  padding: 2rem;
  margin-right: 2rem;
  align-self: stretch;
  box-shadow: ${({ theme }) => theme.effects.shadow};
  background-color: ${({ theme }) => theme.colors.dark.darkest};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
`;

const ExpenseHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ExpenseTitle = styled.h4`
  font-size: 1.75rem;
  font-weight: bold;
`;

const ExpenseLink = styled.button`
  border: none;
  background: none;
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
  width: 15ch;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.primary.default};
  }
  &:focus {
    color: ${({ theme }) => theme.colors.primary.default};
  }
`;

const ExpenseDate = styled.time<IExpenseDateStyleProps>`
  color: ${({ theme }) => theme.colors.light.default};
  font-size: 1.4rem;
`;

const ExpenseDescription = styled.p`
  margin: 0.5rem 0;
  color: ${({ theme }) => theme.colors.light.darker};
`;

const ExpenseItem = ({
  expense,
  wallet,
  subMenuOpen,
  setSubMenuOpen,
}: IExpenseItemProps) => {
  return (
    <ExpenseCard>
      <ExpenseHeader>
        <ExpenseTitle>
          <ExpenseLink onClick={() => setSubMenuOpen(expense.id)}>
            {expense.title}
          </ExpenseLink>
        </ExpenseTitle>
        <p>
          {expense.amount} {wallet.currency}
        </p>
      </ExpenseHeader>
      <ExpenseDate datetime={expense.createdAt}>
        {moment(expense.createdAt).format("dddd, MMMM Do")}
      </ExpenseDate>
      <ExpenseDescription>{expense.description}</ExpenseDescription>
      <AnimatePresence>
        {subMenuOpen === expense.id && (
          <ExpenseSubMenu
            expense={expense}
            wallet={wallet}
            closeSubMenu={() => setSubMenuOpen(null)}
          />
        )}
      </AnimatePresence>
    </ExpenseCard>
  );
};

export default ExpenseItem;
