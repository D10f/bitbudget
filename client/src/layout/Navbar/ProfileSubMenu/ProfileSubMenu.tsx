import React, { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";

import { useAppDispatch } from "@hooks/useAppDispatch";
import { logoutUser } from "@features/user/userSlice";
import WalletForm from "@features/wallets/WalletForm";
import UserProfile from "@features/user/UserProfile";
import CategoriesList from "@features/categories/CategoriesList/CategoriesList";

import Button from "@components/Button/Button";
import Icon from "@components/Icon/Icon";
import Row from "@components/Row/Row";
import Popup from "@components/Popup/Popup";
import Modal from "@components/Modal/Modal";

interface IProfileSubMenuProps {
  isSubMenuOpen: boolean;
  closeSubMenu: () => void;
}

// Sub menu options (and modal state switches)
const initialState = {
  Profile: false,
  Categories: false,
  "Add Wallet": false,
  Logout: false,
};

const ProfileSubMenu = ({
  isSubMenuOpen,
  closeSubMenu,
}: IProfileSubMenuProps) => {
  const dispatch = useAppDispatch();
  const [prompts, setPrompts] = useState(initialState);

  const onClickOutside = () => {
    // Helps to keep modals and submenus open when accidentally click away
    if (Object.values(prompts).some(Boolean) || !isSubMenuOpen) {
      return;
    }
    closeSubMenu();
  };

  const clearPrompts = useCallback(() => setPrompts(initialState), []); // minor optimization

  const logoutPromptModal = () => (
    <Modal requestClose={clearPrompts}>
      <p>Are you sure you want to logout?</p>
      <Row>
        <Button variant="action" onClick={() => dispatch(logoutUser())}>
          Logout
        </Button>
        <Button variant="link" onClick={clearPrompts}>
          Cancel
        </Button>
      </Row>
    </Modal>
  );

  const walletPromptModal = () => (
    <Modal title="Add Wallet" requestClose={clearPrompts}>
      <WalletForm
        submitCallback={() => {
          setPrompts(initialState);
        }}
      />
    </Modal>
  );

  const categoriesPromptModal = () => (
    <Modal title="Expense Categories" requestClose={clearPrompts}>
      <CategoriesList
        submitCallback={() => {
          setPrompts(initialState);
        }}
      />
    </Modal>
  );

  const profilePromptModal = () => (
    <Modal title="Profile" requestClose={clearPrompts}>
      <UserProfile
        submitCallback={() => {
          clearPrompts();
        }}
      />
    </Modal>
  );

  return (
    <Popup onClickOutside={onClickOutside}>
      <>
        {Object.keys(initialState).map((option) => {
          const iconName = option.toLowerCase().split(" ")[0];
          return (
            <Button
              key={option}
              variant="link"
              icon={<Icon name={iconName} />}
              onClick={() => setPrompts({ ...initialState, [option]: true })}
            >
              {option}
            </Button>
          );
        })}
      </>
      <AnimatePresence>
        {prompts["Profile"] && profilePromptModal()}
      </AnimatePresence>
      <AnimatePresence>
        {prompts["Categories"] && categoriesPromptModal()}
      </AnimatePresence>
      <AnimatePresence>
        {prompts["Add Wallet"] && walletPromptModal()}
      </AnimatePresence>
      <AnimatePresence>
        {prompts["Logout"] && logoutPromptModal()}
      </AnimatePresence>
    </Popup>
  );
};

export default ProfileSubMenu;
