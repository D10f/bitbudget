import React, { useLayoutEffect, useRef } from "react";
import { StyledPopup } from "./Popup.styled";
import { useClickOutside } from "@hooks/useClickOutside";

interface IPopupProps {
  children: React.ReactChild[];
  align?: "bottom" | "top" | "right" | "left";
  ref?: React.RefObject<HTMLElement>;
  onClickOutside?: () => void;
}

const slideInLeft = {
  initial: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 50,
    transition: {
      type: "spring",
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    x: 75,
    transition: {
      duration: 0.1,
    },
  },
};

const Popup = ({ children, align, onClickOutside }: IPopupProps) => {
  const popupRef = useRef<HTMLElement>(null);

  useClickOutside(popupRef, () => {
    if (onClickOutside) {
      onClickOutside();
    }
  });

  useLayoutEffect(() => {
    const el = popupRef.current;
    if (!el) return;
    const coords = el.getBoundingClientRect();
    const isOffscreenX = coords.x + coords.width > window.innerWidth - 20; // 20 is for 20px of padding
    const isOffscreenY = coords.y + coords.height > window.innerHeight - 20;
    if (isOffscreenX) {
      el.style.right = "10rem";
    }
    if (isOffscreenY) {
      el.style.bottom = "2rem";
    }
  }, [popupRef]);

  return (
    <StyledPopup
      variants={slideInLeft}
      initial="initial"
      animate="visible"
      exit="exit"
      key="1"
      ref={popupRef}
    >
      {children}
    </StyledPopup>
  );
};

export default Popup;
