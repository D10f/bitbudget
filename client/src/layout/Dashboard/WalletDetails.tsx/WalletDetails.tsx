import React from "react";
import styled from "styled-components";
import SelectInput from "../../../common/components/Form/SelectInput";
import TextInput from "../../../common/components/Form/TextInput";
import MonthPicker from "./MonthPicker";

interface IWalletDetailsProps {
  wallet: IWallet | undefined;
}

const WalletCard = styled.section`
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
`;

const WalletTitle = styled.h2`
  font-size: 2rem;
`;

const WalletDetails = ({ wallet }: IWalletDetailsProps) => {
  return (
    <WalletCard>
      <WalletHeader>
        <WalletTitle>{wallet?.name}</WalletTitle>
        <MonthPicker />
      </WalletHeader>
    </WalletCard>
  );
};

export default WalletDetails;
