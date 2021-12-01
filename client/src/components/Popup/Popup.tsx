import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

interface IPopupProps {
  children: React.ReactChild[];
}

interface IPopupStyles {
  ref?: any
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
`;

const Popup = React.forwardRef(({ children }: IPopupProps, ref) => {
  return (
    <StyledPopup
      variants={slideInMotion}
      initial="initial"
      animate="visible"
      ref={ref}
    >
      {children}
    </StyledPopup>
  );
});

export default Popup;