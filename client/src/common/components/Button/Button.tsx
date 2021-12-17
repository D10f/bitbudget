import React from "react";
import styled, { css } from "styled-components";

interface IButtonProps {
  children: React.ReactChild;
  className?: string;
  disabled?: boolean;
  variant?: "action" | "link";
  type?: "submit" | "button";
  icon?: JSX.Element;
  iconPosition?: "start" | "end";
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

interface StyledButtonProps {
  variant: string;
  disabled?: boolean;
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
  color: ${({ theme }) => theme.colors.dark.default};
  padding: 1rem 2rem;
  filter: ${({ disabled }) => disabled ? 'grayscale(1)' : 'unset'};

  &:hover,
  &:focus {
    cursor: ${({ disabled }) => disabled ? 'regular' : 'pointer'};
    color: ${({ theme, disabled }) => disabled ? theme.colors.dark.default : theme.colors.light.default};
    background-color: ${({ theme }) => theme.colors.primary.default};
  }

  ${({ variant }) =>
    variant === "link" &&
    css<StyledButtonProps>`
      padding: 0.5rem 0;
      background: none;
      color: ${({ theme, disabled }) => disabled ? theme.colors.light.darker : theme.colors.light.default};

      &:hover,
      &:focus {
        color: ${({ theme, disabled }) => disabled ? theme.colors.light.darker : theme.colors.primary.default};
        background: none;
      }

      svg {
        width: 1.6rem;
        height: 1.6rem;
        fill: ${({ theme }) => theme.colors.light.default};
      }
    `}
`;

const Button = ({
  children,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  icon,
  disabled = false,
  iconPosition = "start",
  variant = "action",
}: IButtonProps) => {
  return (
    <StyledButton disabled={disabled} variant={variant} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={className}>
      {iconPosition === "start" && icon}
      {children}
      {iconPosition === "end" && icon}
    </StyledButton>
  );
};

export default Button;
