import React from "react";
import { StyledPopup } from './Popup.styled';

interface IPopupProps {
  children: React.ReactChild[];
  align?: string;
}

const slideInMotion = {
  initial: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 100,
    transition: {
      type: "spring",
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    x: 200,
    transition: {
      duration: 0.1,
    },
  },
};

const Popup = React.forwardRef(({ children, align }: IPopupProps, ref) => {
  return (
    <StyledPopup
      variants={slideInMotion}
      initial="initial"
      animate="visible"
      exit="exit"
      key="1"
      ref={ref}
      align={align}
    >
      {children}
    </StyledPopup>
  );
});

export default Popup;
