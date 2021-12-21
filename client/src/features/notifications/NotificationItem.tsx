import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { removeNotification } from "./notificationsSlice";
import { useAppDispatch } from "../../common/hooks/useAppDispatch";
import Icon from "../../common/components/Icon/Icon";

interface INotificationProps extends INotification {}

interface INotificationCardStyle {
  type?: string;
}

const popupMotion = {
  initial: {
    scale: 0,
  },
  visible: {
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.3,
    },
  },
};

const NotificationCard = styled(motion.article)<INotificationCardStyle>`
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

const NotificationItem = ({ id, msg, duration, type }: INotificationProps) => {
  const dispatch = useAppDispatch();

  setTimeout(() => {
    dispatch(removeNotification(id));
  }, duration);

  return (
    <NotificationCard
      variants={popupMotion}
      initial="initial"
      animate="visible"
      exit="initial"
      type={type}
    >
      <Icon name={type} />
      {msg}
    </NotificationCard>
  );
};

export default React.memo(NotificationItem);
