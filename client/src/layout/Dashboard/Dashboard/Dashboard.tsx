import React, { useEffect } from "react";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { useAppSelector } from "@hooks/useAppSelector";
import { startGetExpenses } from "@features/expenses/expensesSlice";
import { selectCurrentMMYY } from "@features/filters/filtersSlice";
import { selectCurrentWallet } from "@features/wallets/walletsSlice";

import DailyExpenses from "../DailyExpenses/DailyExpenses";
import CategorySummary from "../CategorySummary/CategorySummary";
import WalletDetails from "../WalletDetails/WalletDetails";

import { DashboardContainer } from "./Dashboard.styled";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const currentWallet = useAppSelector(selectCurrentWallet)!;
  const currentMMYY = useAppSelector(selectCurrentMMYY);

  useEffect(() => {
    dispatch(startGetExpenses(currentWallet, currentMMYY));
  }, [dispatch, currentWallet, currentMMYY]);

  return (
    <DashboardContainer>
      <WalletDetails wallet={currentWallet} />
      <CategorySummary />
      <DailyExpenses />
    </DashboardContainer>
  );
};

export default Dashboard;
