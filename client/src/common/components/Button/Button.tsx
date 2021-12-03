import React from "react";
import styled, { css } from "styled-components";

interface IButtonProps {
  children: React.ReactChild;
  variant?: "action" | "link";
  type?: "submit" | "button";
  icon?: JSX.Element;
  iconPosition?: "start" | "end";
  onClick?: () => void;
}

interface StyledButtonProps {
  variant: string;
}

const StyledButton = styled.button<StyledButtonProps>`
  display: flex;
  justify-items: flex-start;
  align-items: center;
  gap: 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  background-image: linear-gradient(
    to right bottom,
    ${({ theme }) => theme.colors.primary.light},
    ${({ theme }) => theme.colors.primary.dark}
  );
  color: ${({ theme }) => theme.colors.dark};
  padding: 1rem 2rem;

  &:hover,
  &:focus {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.light};
    background-color: ${({ theme }) => theme.colors.primary.default};
  }

  ${({ variant }) =>
    variant === "link" &&
    css`
      padding: 0.5rem 0;
      background: none;
      color: ${({ theme }) => theme.colors.light};

      &:hover,
      &:focus {
        color: ${({ theme }) => theme.colors.primary.default};
        background: none;
      }

      svg {
        width: 1.6rem;
        height: 1.6rem;
        fill: ${({ theme }) => theme.colors.light};
      }
    `}
`;

const Button = ({
  children,
  onClick,
  icon,
  iconPosition = "start",
  variant = "action",
}: IButtonProps) => {
  return (
    <StyledButton variant={variant} onClick={onClick}>
      {iconPosition === "start" && icon}
      {children}
      {iconPosition === "end" && icon}
    </StyledButton>
  );
};

export default Button;
