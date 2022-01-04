import React from "react";
import { StyledIcon, StyledLabel, StyledInput } from "./TextInput.styled";

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
