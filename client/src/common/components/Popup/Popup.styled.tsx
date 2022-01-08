import { motion } from "framer-motion";
import styled, { css } from "styled-components";

interface IPopupStyles {
  align?: "bottom" | "top" | "right" | "left";
}

export const StyledPopup = styled(motion.aside)<IPopupStyles>`
  position: absolute;
  min-width: max-content;
  padding: 1rem 2rem;
  border: 1px solid #999;
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  background-color: ${({ theme }) => theme.colors.dark.darker};
  box-shadow: ${({ theme }) => theme.effects.shadow};
  z-index: ${({ theme }) => theme.depth.popup};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    /* Affects the title only */
    font-size: 2.2rem;
  }

  /* ${({ align }) => {
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
  }} */

`;