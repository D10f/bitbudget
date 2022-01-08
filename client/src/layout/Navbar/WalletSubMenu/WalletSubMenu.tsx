import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";

import { useAppDispatch } from "@hooks/useAppDispatch";
import {
  selectWallet,
  deleteWalletAsync,
  updateWalletAsync,
} from "@features/wallets/walletsSlice";
import WalletForm from "@features/wallets/WalletForm";
import ExpenseForm from "@features/expenses/ExpenseForm";

import Button from "@components/Button/Button";
import Icon from "@components/Icon/Icon";
import Row from "@components/Row/Row";
import Popup from "@components/Popup/Popup";
import Modal from "@components/Modal/Modal";

interface IWalletSubMenuProps {
  wallet: IWallet;
  isSubMenuOpen: boolean;
  closeSubMenu: () => void;
}

const WalletTitle = styled.h3`
  padding: 1rem 0;
`;

// Prompts
const initialState = {
  delete: false,
  editing: false,
  expense: false,
};

const WalletSubMenu = ({
  wallet,
  isSubMenuOpen,
  closeSubMenu,
}: IWalletSubMenuProps) => {
  const dispatch = useAppDispatch();
  const [prompts, setPrompts] = useState(initialState);
  const clearPrompts = useCallback(() => setPrompts(initialState), []);

  const onClickOutside =  () => {
    if (
      prompts.delete ||
      prompts.editing ||
      prompts.expense ||
      !isSubMenuOpen
    ) {
      return;
    }
    closeSubMenu();
  };

  const editWalletModal = () => (
    <Modal title="Edit Wallet" requestClose={clearPrompts}>
      <WalletForm
        wallet={wallet}
        submitCallback={() => {
          updateWalletAsync(wallet);
          setPrompts(initialState);
        }}
      />
    </Modal>
  );

  const createExpenseModal = () => (
    <Modal title="New Expense" requestClose={clearPrompts}>
      <ExpenseForm
        walletId={wallet.id}
        submitCallback={() => {
          clearPrompts();
          closeSubMenu();
        }}
      />
    </Modal>
  );

  const confirmDeleteModal = () => (
    <Modal requestClose={clearPrompts}>
      <p>Are you sure you want to delete this wallet?</p>
      <Row>
        <Button
          variant="action"
          onClick={() => {
            dispatch(deleteWalletAsync(wallet));
            setPrompts(initialState);
          }}
        >
          Confirm
        </Button>
        <Button variant="link" onClick={clearPrompts}>
          Cancel
        </Button>
      </Row>
    </Modal>
  );

  const selectCurrentWallet = (wallet: IWallet) => {
    if (!wallet.isCurrent) {
      dispatch(selectWallet(wallet.id));
    }
    closeSubMenu();
  };

  return (
    <Popup onClickOutside={onClickOutside}>
      <WalletTitle>{wallet.name}</WalletTitle>
      <Button
        variant="link"
        icon={<Icon name="view" />}
        disabled={wallet.isCurrent}
        onClick={() => selectCurrentWallet(wallet)}
      >
        View Wallet
      </Button>

      <Button
        variant="link"
        icon={<Icon name="edit" />}
        onClick={() =>
          setPrompts({ delete: false, editing: true, expense: false })
        }
      >
        Edit Wallet
      </Button>

      <Button
        variant="link"
        icon={<Icon name="add" />}
        onClick={() =>
          setPrompts({ delete: false, editing: false, expense: true })
        }
      >
        Add Expense
      </Button>

      <Button
        variant="link"
        icon={<Icon name="trash" />}
        onClick={() =>
          setPrompts({ delete: true, editing: false, expense: false })
        }
      >
        Delete Wallet
      </Button>

      <AnimatePresence>
        {prompts.delete && confirmDeleteModal()}
      </AnimatePresence>
      <AnimatePresence>{prompts.editing && editWalletModal()}</AnimatePresence>
      <AnimatePresence>
        {prompts.expense && createExpenseModal()}
      </AnimatePresence>
    </Popup>
  );
};

export default WalletSubMenu;
