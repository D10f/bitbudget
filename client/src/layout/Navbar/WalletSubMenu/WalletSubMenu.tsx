import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { useAppDispatch } from "../../../common/hooks/useAppDispatch";
import { useClickOutside } from "../../../common/hooks/useClickOutside";
import {
  selectWallet,
  deleteWalletAsync,
  updateWalletAsync,
} from "../../../features/wallets/walletsSlice";

import Button from "../../../common/components/Button/Button";
import Icon from "../../../common/components/Icon/Icon";
import Row from "../../../common/components/Row/Row";
import Popup from "../../../common/components/Popup/Popup";
import Modal from "../../../common/components/Modal/Modal";
import WalletForm from "../../../common/components/WalletForm/WalletForm";
import ExpenseForm from "../../../common/components/ExpenseForm/ExpenseForm";
import { AnimatePresence } from "framer-motion";

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

  const [prompts, setPrompts] = useState(initialState);
  const clearPrompts = useCallback(() => setPrompts(initialState), []);
  const dispatch = useAppDispatch();

  const popupRef = useRef() as React.MutableRefObject<HTMLElement>;

  // Closes this submenu when clicked outside, but not when there's one of the modals open
  const closeOnClickOutside = () => {
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

  useClickOutside(popupRef, closeOnClickOutside);

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
      <ExpenseForm submitCallback={clearPrompts} />
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
    <Popup ref={popupRef}>
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
        onClick={() => setPrompts({ delete: false, editing: true, expense: false })}
      >
        Edit Wallet
      </Button>

      <Button
        variant="link"
        icon={<Icon name="add" />}
        onClick={() => setPrompts({ delete: false, editing: false, expense: true })}
      >
        Add Expense
      </Button>

      <Button
        variant="link"
        icon={<Icon name="trash" />}
        onClick={() => setPrompts({ delete: true, editing: false, expense: false })}
      >
        Delete Wallet
      </Button>

      <AnimatePresence>{prompts.delete && confirmDeleteModal()}</AnimatePresence>
      <AnimatePresence>{prompts.editing && editWalletModal()}</AnimatePresence>
      <AnimatePresence>{prompts.expense && createExpenseModal()}</AnimatePresence>
    </Popup>
  );
};

export default WalletSubMenu;
