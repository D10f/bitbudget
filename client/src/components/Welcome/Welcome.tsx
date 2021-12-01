import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../app/hooks';

const StyledBackground = styled.aside`
  position: absolute;
  top: 2rem;
  left: 20rem;
  width: calc(100% - 40rem);
  height: calc(100vh - 4rem);
  background: none;
  border: 1px solid red;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledHeader = styled.header`
  color: ${({ theme }) => theme.colors.dark.darkest};
  font-size: 3rem;
`;

const Welcome = () => {
  const hasWallets = useAppSelector(state => Boolean(state.wallets.length));

  if (hasWallets) {
    return null;
  }

  return (
    <StyledBackground>
      <StyledHeader>
        To-do: create a sliding gallery with welcoming tips and explanations
      </StyledHeader>
    </StyledBackground>
  )
};

export default Welcome;