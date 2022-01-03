import React from "react";
import styled from "styled-components";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
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

const popupMotion = {
  initial: {
    scale: 0,
  },
  visible: {
    scale: 1,
    transition: {
      type: "spring",
      delay: 0.2,
      duration: 0.3,
    },
  },
  exit: {
    scale: 0,
    transition: {
      delay: 0.5,
      duration: 0.2,
    },
  },
};

const ExpenseCard = styled(motion.article)`
  position: relative;
  /* max-width: 35rem; */
  padding: 2rem;
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
    <ExpenseCard
      key={expense.id}
      variants={popupMotion}
      initial="initial"
      animate="visible"
      exit="exit"
    >
      <ExpenseHeader>
        <ExpenseTitle>
          <ExpenseLink
            onClick={() =>
              setImmediate(() => {
                setSubMenuOpen(subMenuOpen === expense.id ? null : expense.id);
              })
            }
          >
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
