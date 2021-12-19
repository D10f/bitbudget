import React, { useState, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useClickOutside } from "../../../common/hooks/useClickOutside";
import Button from "../../../common/components/Button/Button";
import Icon from "../../../common/components/Icon/Icon";
import Row from "../../../common/components/Row/Row";
import Popup from "../../../common/components/Popup/Popup";
import Modal from "../../../common/components/Modal/Modal";
import SignupForm from "../../../common/components/SignupForm/SignupForm";
import WalletForm from "../../../common/components/WalletForm/WalletForm";

interface IProfileSubMenuProps {
  isSubMenuOpen: boolean;
  closeSubMenu: () => void;
}

// Prompts
const initialState = {
  logout: false,
  signup: false,
  wallet: false,
};

const ProfileSubMenu = ({
  isSubMenuOpen,
  closeSubMenu,
}: IProfileSubMenuProps) => {
  const [prompts, setPrompts] = useState(initialState);
  const clearPrompts = useCallback(() => setPrompts(initialState), []);

  // Closes this submenu when clicked outside
  const popupRef = useRef() as React.MutableRefObject<HTMLElement>;
  const closeOnClickOutside = () => {
    if (prompts.logout || prompts.signup || prompts.wallet || !isSubMenuOpen) {
      return;
    }
    closeSubMenu();
  };

  useClickOutside(popupRef, closeOnClickOutside);

  const logoutPromptModal = () => (
    <Modal requestClose={clearPrompts}>
      <p>Are you sure you want to logout?</p>
      <Row>
        <Button variant="action">Logout</Button>
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

  const signupPromptModal = () => (
    <Modal title="Signup" requestClose={clearPrompts}>
      <SignupForm />
    </Modal>
  );

  return (
    <Popup ref={popupRef} align="bottom">
      <Button
        variant="link"
        icon={<Icon name="profile" />}
        onClick={() =>
          setPrompts({ signup: true, logout: false, wallet: false })
        }
      >
        Profile
      </Button>

      <Button
        variant="link"
        icon={<Icon name="add" />}
        onClick={() =>
          setPrompts({ signup: false, logout: false, wallet: true })
        }
      >
        New Wallet
      </Button>

      <Button
        variant="link"
        icon={<Icon name="logout" />}
        onClick={() =>
          setPrompts({ signup: false, logout: true, wallet: false })
        }
      >
        Logout
      </Button>

      <AnimatePresence>{prompts.signup && signupPromptModal()}</AnimatePresence>
      <AnimatePresence>{prompts.wallet && walletPromptModal()}</AnimatePresence>
      <AnimatePresence>{prompts.logout && logoutPromptModal()}</AnimatePresence>
    </Popup>
  );
};

export default ProfileSubMenu;
