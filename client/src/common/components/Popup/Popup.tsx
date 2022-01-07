import useMediaQuery from "@hooks/useMediaQuery";
import React, { useLayoutEffect, useRef } from "react";
import { StyledPopup } from './Popup.styled';
import { breakpoints } from '@constants';
import { useClickOutside } from "@hooks/useClickOutside";

interface IPopupProps {
  children: React.ReactChild[];
  align?: "bottom" | "top" | "right" | "left";
  ref?: React.RefObject<HTMLElement>
  onClickOutside?: () => void;
}

const slideInLeft = {
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

const slideInRight = {
  initial: {
    opacity: 0,
    x: 0,
  },
  visible: {
    opacity: 1,
    x: -50,
    transition: {
      type: "spring",
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.1,
    },
  },
};

const Popup = ({ children, align, onClickOutside }: IPopupProps) => {

  const popupRef = useRef<HTMLElement>(null);
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.md})`);
  
  useClickOutside(popupRef, () => {
    if (onClickOutside) {
      onClickOutside();
    }
  });
  
  useLayoutEffect(() => {
    console.log(popupRef.current);
  }, [popupRef]);

  return (
    <StyledPopup
      variants={isMobile ? slideInRight : slideInLeft}
      initial="initial"
      animate="visible"
      exit="exit"
      key="1"
      ref={popupRef}
      align={align}
    >
      {children}
    </StyledPopup>
  );
};

export default Popup;
