import React from "react";
import {
  StyledLabel,
  StyledIcon,
  StyledSpan,
  StyledTextArea,
} from "./TextArea.styled";

interface ITextAreaProps {
  label: string;
  name: string;
  value: string;
  error?: boolean;
  placeholder?: string;
  maxLength?: number;
  readOnly?: boolean;
  autoFocus?: boolean;
  hideLabel?: boolean;
  onChange: () => void;
}

const TextArea = React.forwardRef(
  (
    {
      label,
      value,
      name,
      placeholder,
      onChange,
      readOnly = false,
      maxLength = 250,
      hideLabel = false,
      error = false,
    }: ITextAreaProps,
    ref
  ) => {
    const charactersLeft = maxLength - value.length;
    return (
      <>
        <StyledLabel htmlFor={name} hide={hideLabel}>
          {label}
        </StyledLabel>
        <StyledTextArea
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={onChange}
          maxLength={maxLength}
          autocomplete="off"
          rows={5}
          error={error}
        />
        {error && <StyledIcon name="error" />}
        <StyledSpan>{charactersLeft} characters left</StyledSpan>
      </>
    );
  }
);

export default TextArea;
