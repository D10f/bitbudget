import { motion } from "framer-motion";
import styled from "styled-components";

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
  position: fixed;

  @media (max-width: ${({ theme }) => theme.breakpoints.tabletPortrait}) {
    /* Affects the title only */
    font-size: 2.2rem;
  }
`;