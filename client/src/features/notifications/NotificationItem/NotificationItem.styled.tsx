import styled from "styled-components";
import { motion } from "framer-motion";

interface INotificationCardStyle {
  type?: string;
}

export const NotificationCard = styled(motion.article)<INotificationCardStyle>`
  background-color: ${({ theme }) => theme.colors.dark.darkest};
  color: ${({ theme }) => theme.colors.light};
  box-shadow: ${({ theme }) => theme.effects.shadow};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;

  svg {
    width: 2.2rem;
    height: 2.2rem;
    flex: 1 0 auto;
    fill: ${({ theme, type }) => {
      switch (type) {
        case "success":
          return theme.colors.success;
        case "error":
          return theme.colors.error;
        case "info":
          return theme.colors.secondary.default;
        default:
          return theme.colors.light;
      }
    }};
  }
`;
