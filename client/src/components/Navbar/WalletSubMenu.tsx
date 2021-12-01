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
  const dispatch = useAppDispatch();

  // Closes this submenu when clicked outside
  const popupRef = useRef() as React.MutableRefObject<HTMLElement>;
  const closeOnClickOutside = () => {
    if (deletePrompt || editingModal || !isSubMenuOpen) {
      return;
    }
    closeSubMenu();
  };

  useClickOutside(popupRef, closeOnClickOutside);

  if (!isSubMenuOpen) {
    return null;
  }

  const editWalletModal = () => (
    <Modal
      key="dsdfds"
      title="Edit Wallet"
      isOpen={editingModal}
      requestClose={() => setEditingModal(false)}
    >
      <WalletForm
        wallet={wallet}
        submitCallback={() => setEditingModal(false)}
      />
    </Modal>
  );

  const confirmDeleteModal = () => (
    <Modal isOpen={deletePrompt} requestClose={() => setDeletePrompt(false)}>
      <p>Are you sure you want to delete this wallet?</p>
      <p>This action cannot be undone.</p>
      <Row>
        <Button variant="action" onClick={() => dispatch(deleteWallet(wallet))}>
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

      <Button variant="link" icon={<Icon name="add" />}>
        Add Expense
      </Button>

      <Button
        variant="link"
        icon={<Icon name="trash" />}
        onClick={() => setDeletePrompt(true)}
      >
        Delete Wallet
      </Button>

      {confirmDeleteModal()}
      {editWalletModal()}
    </Popup>
  );
};

export default WalletSubMenu;
