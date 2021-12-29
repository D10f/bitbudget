import React, { useEffect } from "react";
import { useAppDispatch } from "../../common/hooks/useAppDispatch";
import { useAppSelector } from "../../common/hooks/useAppSelector";
import {
  startGetExpenses,
} from "../../features/expenses/expensesSlice";
import { selectCurrentMMYY } from "../../features/filters/filtersSlice";
import { selectCurrentWallet } from "../../features/wallets/walletsSlice";
import MonthSummary from "./MonthSummary/MonthSummary";
import WalletDetails from "./WalletDetails/WalletDetails";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const currentWallet = useAppSelector(selectCurrentWallet)!;
  const currentMMYY = useAppSelector(selectCurrentMMYY);

  useEffect(() => {
    dispatch(startGetExpenses(currentWallet, currentMMYY));
  }, [currentWallet, currentMMYY]);

  return (
    <>
      <WalletDetails wallet={currentWallet} />
      <MonthSummary />
    </>
  );
};

export default Dashboard;
