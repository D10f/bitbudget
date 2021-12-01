import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import Button from "../Buttons/Button";
import { createPortal } from "react-dom";
import { useKeyPress } from "../../hooks/useKeyPress";

interface IModalProps {
  title?: string;
  children: React.ReactChild[] | React.ReactChild;
  requestClose: () => void;
}

const popupMotion = {
  initial: {
    scale: 0,
    translateX: "-50%",
  },
  visible: {
    scale: 1,
    translateX: "-50%",
    transition: {
      type: "spring",
      duration: 0.3,
    },
  },
  exit: {
    scale: 0,
    translateX: "-50%",
    transition: {
      duration: 0.1
    }
  }
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  overflow-y: auto;
  overflow-x: hidden;
  position: absolute;
  top: 4rem;
  left: 50%;
  max-width: 80vw;
  max-height: 90vh;
  padding: 4rem;
  border: 1px solid ${({ theme }) => theme.colors.dark.darkest};
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

const ModalContent = styled.section`
  flex: 1;
`;

const Modal = ({ requestClose, title, children }: IModalProps) => {
  useKeyPress("Escape", requestClose);

  return createPortal(
    <Background>
      <Container
        key={Math.random().toString()}
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

        <ModalContent>{children}</ModalContent>
      </Container>
    </Background>,
    document.getElementById("root")!
  );
};

export default Modal;
