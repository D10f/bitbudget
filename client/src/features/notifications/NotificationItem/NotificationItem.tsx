import React from "react";
import { removeNotification } from "@features/notifications/notificationsSlice";
import { useAppDispatch } from "@hooks/useAppDispatch";
import Icon from "@components/Icon/Icon";
import { NotificationCard } from "./NotificationItem.styled";

interface INotificationProps extends INotification {}

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
