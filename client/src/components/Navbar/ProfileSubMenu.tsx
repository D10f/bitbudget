import React, { useState, useRef } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import Button from "../Buttons/Button";
import Icon from "../Icons/Icon";
import Row from "../Row/Row";
import Popup from "../Popup/Popup";
import Modal from "../Modal/Modal";
import { AnimatePresence } from "framer-motion";
import SignupForm from "../Forms/SignupForm";

interface IProfileSubMenuProps {
  id: string;
  isSubMenuOpen: boolean;
  closeSubMenu: () => void;
}

const ProfileSubMenu = ({
  id,
  isSubMenuOpen,
  closeSubMenu,
}: IProfileSubMenuProps) => {
  const [logoutPrompt, setLogoutPrompt] = useState(false);
  const [signupPrompt, setSignupPrompt] = useState(false);

  // Closes this submenu when clicked outside
  const popupRef = useRef() as React.MutableRefObject<HTMLElement>;
  const closeOnClickOutside = () => {
    if (logoutPrompt || signupPrompt || !isSubMenuOpen) {
      return;
    }
    closeSubMenu();
  };

  useClickOutside(popupRef, closeOnClickOutside);

  const logoutPromptModal = () => (
    <Modal requestClose={() => setLogoutPrompt(false)}>
      <p>Are you sure you want to logout?</p>
      <Row>
        <Button variant="action">Logout</Button>
        <Button variant="link" onClick={() => setLogoutPrompt(false)}>
          Cancel
        </Button>
      </Row>
    </Modal>
  );

  const signupPromptModal = () => (
    <Modal title="Signup" requestClose={() => setSignupPrompt(false)}>
      <SignupForm />
    </Modal>
  );

  return (
    <Popup ref={popupRef} align="bottom">
      <Button variant="link" icon={<Icon name="profile" />} onClick={() => setSignupPrompt(true)}>
        Profile
      </Button>

      <Button
        variant="link"
        icon={<Icon name="logout" />}
        onClick={() => setLogoutPrompt(true)}
      >
        Logout
      </Button>

      <AnimatePresence>{logoutPrompt && logoutPromptModal()}</AnimatePresence>
      <AnimatePresence>{signupPrompt && signupPromptModal()}</AnimatePresence>
    </Popup>
  );
};

export default ProfileSubMenu;
