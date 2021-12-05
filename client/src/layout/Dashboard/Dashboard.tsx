import React from 'react';
import { useAppSelector } from '../../common/hooks/useAppSelector';
import MonthSummary from './MonthSummary/MonthSummary';
import WalletDetails from './WalletDetails/WalletDetails';

const Dashboard = () => {
  
  const currentWallet = useAppSelector(state => state.wallets.wallets.find(w => w.isCurrent));

  return (
    <>
      <WalletDetails wallet={currentWallet} />
      <MonthSummary />
    </>
  );
};

export default Dashboard;