import React from "react";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useAppSelector } from "../../app/hooks";
import NotificationItem from "./NotificationItem";

const NotificationContainer = styled.aside`
  position: absolute;
  right: 0;
  top: 0;
  height: 99%;
  width: 40%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 2rem;
`;
const Notifications = () => {
  const notifications = useAppSelector((state) => state.ui.notifications);

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
