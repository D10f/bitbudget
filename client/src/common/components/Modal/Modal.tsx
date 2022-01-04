import React from "react";
import { createPortal } from "react-dom";
import { useKeyPress } from "@hooks/useKeyPress";
import {
  Container,
  ModalHeader,
  Background,
  CloseButton,
} from "./Modal.styled";

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
