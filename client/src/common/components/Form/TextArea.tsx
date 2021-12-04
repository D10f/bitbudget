import React from "react";
import styled from "styled-components";

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

interface ITextAreaStyleProps {
  error?: boolean;
  autocomplete: "on" | "off";
}

interface ILabelStyleProps {
  hide?: boolean;
}

const StyledTextArea = styled.textarea<ITextAreaStyleProps>`
  margin: 1rem 0;
  padding: 1rem;
  font-size: 1.6rem;
  max-height: 30rem;
  min-width: 30rem;
  height: auto;
  outline: none;
  border: none;
  border: 1px solid
    ${({ theme, error }) => (error ? theme.colors.error : theme.colors.light.default)};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  background: ${({ theme }) => theme.colors.dark.default};
  color: ${({ theme }) => theme.colors.light.default};
  resize: vertical;
`;

const StyledLabel = styled.label<ILabelStyleProps>`
  visibility: ${({ hide }) => (hide ? "hidden" : "visible")};
  height: ${({ hide }) => (hide ? "0px" : "auto")};
`;

const StyledSpan = styled.span`
  color: lightgray;
  font-size: 1.2rem;
`;

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
        />
        <StyledSpan>{charactersLeft} characters left</StyledSpan>
      </>
    );
  }
);

export default TextArea;
