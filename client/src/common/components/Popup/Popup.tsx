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
    const isOffscreenX = coords.x + coords.width > window.innerWidth;
    const isOffscreenY = coords.y + coords.height > window.innerHeight;
    if (isOffscreenX) {
      el.style.right = "200%";
    }
    if (isOffscreenY) {
      el.style.bottom = "0";
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
