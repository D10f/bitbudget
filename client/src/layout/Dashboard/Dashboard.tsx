import React, { useEffect } from "react";
import { useAppDispatch } from "../../common/hooks/useAppDispatch";
import { useAppSelector } from "../../common/hooks/useAppSelector";
import { startGetExpenses } from "../../features/expenses/expensesSlice";
import { selectCurrentMMYY } from "../../features/filters/filtersSlice";
import { selectCurrentWallet } from "../../features/wallets/walletsSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import DailyExpenses from "./DailyExpenses/DailyExpenses";
import CategorySummary from "./CategorySummary/CategorySummary";
import WalletDetails from "./WalletDetails/WalletDetails";
import styled from "styled-components";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardContainer = styled.section`
  grid-area: dashboard;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  // These three account for some overflow that crops the shadows
  margin-left: -1rem;
  padding-right: 1rem;
  padding-bottom: 2rem;

  overflow-y: auto;
  overflow-x: overlay;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const currentWallet = useAppSelector(selectCurrentWallet)!;
  const currentMMYY = useAppSelector(selectCurrentMMYY);

  useEffect(() => {
    dispatch(startGetExpenses(currentWallet, currentMMYY));
  }, [currentWallet, currentMMYY]);

  return (
    <DashboardContainer>
      <WalletDetails wallet={currentWallet} />
      <CategorySummary />
      <DailyExpenses />
    </DashboardContainer>
  );
};

export default Dashboard;
