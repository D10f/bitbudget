import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useAppDispatch } from "../../../common/hooks/useAppDispatch";
import { useClickOutside } from "../../../common/hooks/useClickOutside";
import {
  selectWallet,
  deleteWallet,
} from "../../../features/wallets/wallets.reducer";
import { addNotification } from "../../../features/notifications/notifications.reducer";

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

const WalletSubMenu = ({
  wallet,
  isSubMenuOpen,
  closeSubMenu,
}: IWalletSubMenuProps) => {
  const [deletePrompt, setDeletePrompt] = useState(false);
  const [editingModal, setEditingModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);
  const dispatch = useAppDispatch();

  const popupRef = useRef() as React.MutableRefObject<HTMLElement>;

  // Closes this submenu when clicked outside, but not when there's one of the modals open
  const closeOnClickOutside = () => {
    if (deletePrompt || editingModal || expenseModal || !isSubMenuOpen) {
      return;
    }
    closeSubMenu();
  };

  useClickOutside(popupRef, closeOnClickOutside);

  const editWalletModal = () => (
    <Modal title="Edit Wallet" requestClose={() => setEditingModal(false)}>
      <WalletForm
        wallet={wallet}
        submitCallback={() => {
          setEditingModal(false);
        }}
      />
    </Modal>
  );

  const createExpenseModal = () => (
    <Modal title="New Expense" requestClose={() => setExpenseModal(false)}>
      <ExpenseForm submitCallback={() => setEditingModal(false)} />
    </Modal>
  );

  const confirmDeleteModal = () => (
    <Modal requestClose={() => setDeletePrompt(false)}>
      <p>Are you sure you want to delete this wallet?</p>
      <Row>
        <Button
          variant="action"
          onClick={() => {
            dispatch(deleteWallet(wallet));
            dispatch(
              addNotification({
                msg: "Wallet Deleted Successfully",
                type: "success",
              })
            );
          }}
        >
          Confirm
        </Button>
        <Button variant="link" onClick={() => setDeletePrompt(false)}>
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
        onClick={() => setEditingModal(true)}
      >
        Edit Wallet
      </Button>

      <Button
        variant="link"
        icon={<Icon name="add" />}
        onClick={() => setExpenseModal(true)}
      >
        Add Expense
      </Button>

      <Button
        variant="link"
        icon={<Icon name="trash" />}
        onClick={() => setDeletePrompt(true)}
      >
        Delete Wallet
      </Button>

      <AnimatePresence>{deletePrompt && confirmDeleteModal()}</AnimatePresence>
      <AnimatePresence>{editingModal && editWalletModal()}</AnimatePresence>
      <AnimatePresence>{expenseModal && createExpenseModal()}</AnimatePresence>
    </Popup>
  );
};

export default WalletSubMenu;
