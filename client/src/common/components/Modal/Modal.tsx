import React from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import styled from "styled-components";
import Button from "../Button/Button";
import { useKeyPress } from "../../hooks/useKeyPress";

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
    },
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
  /* display: flex;
  justify-content: center;
  align-items: center; */
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(0.2rem); // ignored on firefox
`;

const Container = styled(motion.aside)`
  /* Currently the parent element uses flexbox for positioning */
  /* display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start; */

  /* In either case these two settings don't play well in Chromium browsers */
  /* overflow-x: hidden;
  overflow-y: auto; */

  position: relative;
  margin: 2rem auto;
  width: max-content;

  /* max-width: 80vw; */
  overflow-y: auto;
  overflow-x: hidden;
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
            <Button variant="link" onClick={requestClose}>
              &times;
            </Button>
          </ModalHeader>
        )}

        <section>{children}</section>
      </Container>
    </Background>,
    document.getElementById("root")!
  );
};

export default Modal;
