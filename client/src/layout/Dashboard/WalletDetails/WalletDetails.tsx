import React from "react";
import styled from "styled-components";
import MonthPicker from './MonthPicker/MonthPicker';
import WalletSummary from "./WalletSummary/WalletSummary";

interface IWalletDetailsProps {
  wallet: IWallet | undefined;
}

const WalletCard = styled.article`
  grid-area: wallet;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.dark.darkest};
  box-shadow: ${({ theme }) => theme.effects.shadow};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
`;

const WalletHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const WalletTitle = styled.h2`
  font-size: 3rem;
`;

const WalletDetails = ({ wallet }: IWalletDetailsProps) => {
  return (
    <WalletCard>
      <WalletHeader>
        <WalletTitle>{wallet?.name}</WalletTitle>
        <MonthPicker />
      </WalletHeader>
      <WalletSummary wallet={wallet} />
    </WalletCard>
  );
};

export default WalletDetails;
