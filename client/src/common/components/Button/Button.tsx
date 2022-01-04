import React from "react";
import { StyledButton } from './Button.styled';

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
