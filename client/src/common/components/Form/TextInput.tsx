import React from "react";
import styled, { css } from "styled-components";
import Icon from "../Icon/Icon";

interface ITextInputProps {
  label: string;
  name: string;
  value?: string;
  required?: boolean;
  type?: string;
  error?: boolean;
  placeholder: string;
  hideLabel?: boolean;
  autoFocus?: boolean;
  readOnly?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

interface IStyledLabelProps {
  hide?: boolean;
  required?: boolean;
}

interface IStyledInputProps {
  error?: boolean;
}

const StyledInput = styled.input<IStyledInputProps>`
  position: relative;
  margin: 1rem 0;
  padding: 1rem;
  font-size: 1.6rem;
  min-width: 30rem;
  outline: none;
  border: none;
  border: 1px solid
    ${({ theme, error }) => (error ? theme.colors.error : theme.colors.light.default)};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  background: ${({ theme }) => theme.colors.dark.default};
  color: ${({ theme }) => theme.colors.light.default};
`;

const StyledIcon = styled(Icon)`
  position: absolute;
  top: 4.7rem;
  right: 1.6rem;
  width: 1.6rem;
  height: 1.6rem;
  fill: ${({ theme }) => theme.colors.error};
`;

const StyledLabel = styled.label<IStyledLabelProps>`
  visibility: ${({ hide }) => (hide ? "hidden" : "visible")};
  height: ${({ hide }) => (hide ? "0px" : "auto")};

  ${({ required }) => !required && css`
    &::after {
      content: '(optional)';
      margin-left: 0.25rem;
      font-size: 1.2rem;
    }
  `}
`;

const TextInput = React.forwardRef(
  (
    {
      label,
      name,
      placeholder,
      value = "",
      type = "text",
      required = true,
      error = false,
      hideLabel = false,
      autoFocus = false,
      readOnly = false,
      onChange,
    }: ITextInputProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <>
        <StyledLabel htmlFor={name} hide={hideLabel} required={required}>
          {label}
        </StyledLabel>
        <StyledInput
          ref={ref}
          type={type}
          value={value}
          id={name}
          name={name}
          placeholder={placeholder}
          autoFocus={autoFocus}
          readOnly={readOnly}
          error={error}
          onChange={onChange}
        />
        {error && <StyledIcon name="error" />}
      </>
    );
  }
);

export default TextInput;
