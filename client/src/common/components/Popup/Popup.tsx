import React from "react";
import { motion } from "framer-motion";
import styled, { css } from "styled-components";

interface IPopupProps {
  children: React.ReactChild[];
  align?: string;
}

interface IPopupStyles {
  ref?: any;
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

const StyledPopup = styled(motion.aside)<IPopupStyles>`
  position: absolute;
  min-width: max-content;
  padding: 1rem 2rem;
  border: 1px solid #999;
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  background-color: ${({ theme }) => theme.colors.dark.darker};
  box-shadow: ${({ theme }) => theme.effects.shadow};

  ${({ align }) => {
    switch (align) {
      case "bottom":
        return css`
          bottom: 0;
        `;
      case "top":
        return css`
          top: 0;
        `;
      case "left":
        return css`
          left: 0;
        `;
      case "right":
        return css`
          right: 0;
        `;
    }
  }}

  z-index: ${({ theme }) => theme.depth.popup};
`;

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
