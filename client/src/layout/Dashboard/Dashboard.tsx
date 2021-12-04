import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../common/hooks/useAppSelector';
import WalletDetails from './WalletDetails.tsx/WalletDetails';

const Dashboard = () => {
  
  const currentWallet = useAppSelector(state => state.wallets.wallets.find(w => w.isCurrent));

  return (
    <WalletDetails wallet={currentWallet} />
  );
};

export default Dashboard;