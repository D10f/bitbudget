import styled from "styled-components";
import { motion } from 'framer-motion';
import Button from "../Button/Button";

export const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(0.2rem); // ignored on firefox
  z-index: ${({ theme }) => theme.depth.modal};
`;

export const Container = styled(motion.aside)`
  /* framer-motion doesn't animate these two settings well in Chromium-based browsers */
  overflow-y: auto;
  overflow-x: hidden;

  position: relative;
  margin: 2rem auto;
  width: max-content;
  max-width: 80ch;
  max-height: 90vh;
  padding: 4rem 6rem;
  border: 1px solid ${({ theme }) => theme.colors.light.default};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  background-color: ${({ theme }) => theme.colors.dark.darkest};
  box-shadow: ${({ theme }) => theme.effects.shadow};

  @media (max-width: ${({ theme }) => theme.breakpoints.phone}) {
    width: unset;
    max-width: 95vw;
    padding: 3rem 4rem;
  }
`;

export const ModalHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  margin-bottom: 2rem;
`;

export const CloseButton = styled(Button)`
  // font-size: 3rem;
  transform: scale(3);
`;
