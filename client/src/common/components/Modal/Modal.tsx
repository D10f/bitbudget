import React from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useKeyPress } from "../../hooks/useKeyPress";

import Button from "../Button/Button";

interface IModalProps {
  title?: string;
  children: React.ReactChild[] | React.ReactChild;
  requestClose: () => void;
}

const popupMotion = {
  initial: {
    scale: 0,
  },
  visible: {
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.3,
    }
  },
  exit: {
    scale: 0,
    transition: {
      duration: 0.1,
    },
  },
};

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(0.2rem); // ignored on firefox
`;

const Container = styled(motion.aside)`
  /* framer-motion doesn't animate these two settings well in Chromium-based browsers */
  overflow-y: auto;
  overflow-x: hidden;

  position: relative;
  margin: 2rem auto;
  width: max-content;
  max-height: 90vh;
  padding: 4rem 6rem;
  border: 1px solid ${({ theme }) => theme.colors.light.default};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  background-color: ${({ theme }) => theme.colors.dark.darkest};
  box-shadow: ${({ theme }) => theme.effects.shadow};
  z-index: ${({ theme }) => theme.depth.modal};
`;

const ModalHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  margin-bottom: 2rem;
`;

const CloseButton = styled(Button)`
  transform: scale(1.5);
`;

const Modal = ({ requestClose, title, children }: IModalProps) => {
  useKeyPress("Escape", requestClose);

  return createPortal(
    <Background>
      <Container
        key="modalPopup"
        variants={popupMotion}
        initial="initial"
        animate="visible"
        exit="exit"
        aria-hidden={true}
      >
        {title && (
          <ModalHeader>
            <h1>{title}</h1>
            <CloseButton variant="link" onClick={requestClose}>
              &times;
            </CloseButton>
          </ModalHeader>
        )}

        {children}
      </Container>
    </Background>,
    document.getElementById("root")!
  );
};

export default Modal;
