import React from "react";
import { motion } from "framer-motion";
import styled, { css } from "styled-components";

interface IPopupProps {
  children: React.ReactChild[];
  align?: string;
}

interface IPopupStyles {
  ref?: any
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
};

const StyledPopup = styled(motion.aside)<IPopupStyles>`
  position: absolute;
  top: 0;
  min-width: max-content;
  padding: 1rem 2rem;
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  background-color: ${({ theme }) => theme.colors.dark.darkest};
  box-shadow: ${({ theme }) => theme.effects.shadow};

  ${({ align }) => align === 'bottom' && css`
    top: unset;
    bottom: 0;
  `}
`;

const Popup = React.forwardRef(({ children, align }: IPopupProps, ref) => {
  return (
    <StyledPopup
      variants={slideInMotion}
      initial="initial"
      animate="visible"
      ref={ref}
      align={align}
    >
      {children}
    </StyledPopup>
  );
});

export default Popup;