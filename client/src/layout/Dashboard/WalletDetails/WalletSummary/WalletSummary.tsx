import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useAppSelector } from "../../../../common/hooks/useAppSelector";
import { selectCurrentExpenseAmount } from "../../../../features/expenses/expensesSlice";

interface IWalletSummaryProps {
  wallet: IWallet | undefined;
}

interface ITotalProgressProps {
  value: string;
}

const Container = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
`;

const SummaryContainer = styled.article`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SummaryTitle = styled.h4`
  color: ${({ theme }) => theme.colors.light.darker};
  font-size: 1.2rem;
`;

const SummaryInfo = styled.p`
  color: ${({ theme }) => theme.colors.light.default};
  font-size: 1.75rem;
`;

// Hidden visually but left for accessibility and semantic meaning
const ProgressBar = styled.div`
  grid-column-start: 1;
  grid-column-end: 4;
  height: 1rem;
  background-color: #36393f;
  border: none;
`;

const TotalProgress = styled(motion.div)<ITotalProgressProps>`
  position: relative;
  width: 100%;
  height: 1rem;
  background-image: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.primary.default},
    ${({ theme }) => theme.colors.primary.dark}
  );
  text-align: right;
  font-size: 1.25rem;

  &::after {
    content: attr(value) "%";
    position: absolute;
    right: ${({ value }) => (parseFloat(value) < 10 ? "-4rem" : "0")};
    top: 1rem;
    color: ${({ theme }) => theme.colors.light.default};
  }
`;

const WalletSummary = ({ wallet }: IWalletSummaryProps) => {
  const [expenseAmount, incomeAmount] = useAppSelector(
    selectCurrentExpenseAmount
  );
  const totalExpenseAmnt = expenseAmount.toFixed(2);
  const totalIncomeAmnt = incomeAmount.toFixed(2);

  const budgetUsed = Math.min(
    ((+totalExpenseAmnt - +totalIncomeAmnt) * 100) /
      Math.max(Number(wallet!.budget), 1),
    100
  ).toFixed(2);

  return (
    <Container>
      <SummaryContainer>
        <SummaryTitle>Budget</SummaryTitle>
        <SummaryInfo>
          {wallet?.budget} {wallet?.currency}
        </SummaryInfo>
      </SummaryContainer>

      <SummaryContainer>
        <SummaryTitle>Total Spent</SummaryTitle>
        <SummaryInfo>
          {totalExpenseAmnt} {wallet?.currency}
        </SummaryInfo>
      </SummaryContainer>

      <SummaryContainer>
        <SummaryTitle>Total Income</SummaryTitle>
        <SummaryInfo>
          {totalIncomeAmnt} {wallet?.currency}
        </SummaryInfo>
      </SummaryContainer>

      <ProgressBar
        aria-label="Total budget and total amount spent."
        role="progressbar"
      >
        <TotalProgress
          initial={{ width: "0%" }}
          animate={{ width: budgetUsed + "%" }}
          transition={{ duration: 0.6, type: "spring" }}
          value={budgetUsed}
        />
      </ProgressBar>
    </Container>
  );
};

export default WalletSummary;
