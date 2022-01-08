import React from "react";
import { useAppSelector } from "@hooks/useAppSelector";
import { selectCurrentExpenseAmount } from "@features/expenses/expensesSlice";

import {
  Container,
  SummaryContainer,
  SummaryTitle,
  SummaryInfo,
  ProgressBar,
  TotalProgress,
} from "./WalletSummary.styled";

interface IWalletSummaryProps {
  wallet: IWallet | undefined;
}

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
          transition={{ duration: 1 }}
          value={budgetUsed}
        />
      </ProgressBar>
    </Container>
  );
};

export default WalletSummary;
