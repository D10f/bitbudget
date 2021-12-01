import React, { useState, useRef } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import Button from "../Buttons/Button";
import Icon from "../Icons/Icon";
import Row from "../Row/Row";
import Popup from "../Popup/Popup";
import Modal from "../Modal/Modal";
import { AnimatePresence } from "framer-motion";

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

  // Closes this submenu when clicked outside
  const popupRef = useRef() as React.MutableRefObject<HTMLElement>;
  const closeOnClickOutside = () => {
    if (logoutPrompt || !isSubMenuOpen) {
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

  return (
    <Popup ref={popupRef} align="bottom">
      <Button variant="link" icon={<Icon name="profile" />}>
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
    </Popup>
  );
};

export default ProfileSubMenu;
