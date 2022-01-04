import styled from "styled-components";

export const NotificationContainer = styled.aside`
  position: absolute;
  right: 0;
  top: 0;
  height: 99%;
  width: 40%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 2rem;
  z-index: ${({ theme }) => theme.depth.notifications};
  pointer-events: none;
`;