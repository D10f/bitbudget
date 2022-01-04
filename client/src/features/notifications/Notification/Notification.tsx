import React from "react";
import { AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useAppSelector } from "@hooks/useAppSelector";
import { NotificationContainer } from './Notification.styled';
import NotificationItem from "../NotificationItem/NotificationItem";

const Notifications = () => {
  const notifications = useAppSelector((state) => state.notifications);

  return createPortal(
    <NotificationContainer>
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            id={notification.id}
            msg={notification.msg}
            type={notification.type}
            duration={notification.duration}
          />
        ))}
      </AnimatePresence>
    </NotificationContainer>,
    document.getElementById("root")!
  );
};

export default Notifications;
