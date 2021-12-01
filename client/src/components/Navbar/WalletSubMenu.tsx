import React, { useState, useRef } from "react";
import { useAppDispatch } from "../../app/hooks";
import {
  selectWallet,
  deleteWallet,
} from "../../features/wallets/wallets.reducer";
import { useClickOutside } from "../../hooks/useClickOutside";
import Button from "../Buttons/Button";
import Icon from "../Icons/Icon";
import Row from "../Row/Row";
import Popup from "../Popup/Popup";
import Modal from "../Modal/Modal";
import styled from "styled-components";
import WalletForm from "../Forms/WalletForm";
import { addNotification } from "../../features/ui/ui.reducer";
import ExpenseForm from "../Forms/ExpenseForm";
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

  // Closes this submenu when clicked outside
  const closeOnClickOutside = () => {
    if (deletePrompt || editingModal || expenseModal || !isSubMenuOpen) {
      return;
    }
    closeSubMenu();
  };

  useClickOutside(popupRef, closeOnClickOutside);

  if (!isSubMenuOpen) {
    return null;
  }

  const editWalletModal = () => (
    <Modal title="Edit Wallet" requestClose={() => setEditingModal(false)}>
      <WalletForm
        wallet={wallet}
        submitCallback={() => {
          console.log(editingModal);
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
