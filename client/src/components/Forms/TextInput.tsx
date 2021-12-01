import React from "react";
import styled from "styled-components";

interface ITextInputProps {
  label: string;
  name: string;
  value: string;
  error?: boolean;
  placeholder: string;
  hideLabel?: boolean;
  autoFocus?: boolean;
  readOnly?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

interface IStyledLabelProps {
  hide?: boolean;
}

interface IStyledInputProps {
  error?: boolean;
}

const StyledInput = styled.input<IStyledInputProps>`
  position: relative;
  margin: 1rem 0;
  padding: 1rem;
  font-size: 1.6rem;
  min-height: 4rem;
  min-width: 25rem;
  border: 1px solid ${({ theme, error }) => error ? 'red' : theme.colors.dark.dark};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  background: ${({ theme }) => theme.colors.dark.default};
  color: ${({ theme }) => theme.colors.light};

  &:focus {
    border: 1px solid ${({ theme }) => theme.colors.primary.default};
  }
`;

const StyledLabel = styled.label<IStyledLabelProps>`
  visibility: ${({ hide }) => (hide ? "hidden" : "visible")};
  height: ${({ hide }) => (hide ? "0px" : "auto")};
`;

const TextInput = React.forwardRef(({
  label,
  value,
  name,
  placeholder,
  error = false,
  hideLabel = false,
  autoFocus = false,
  readOnly = false,
  onChange,
}: ITextInputProps, ref) => {
  return (
    <>
      <StyledLabel htmlFor={name} hide={hideLabel}>
        {label}
      </StyledLabel>
      <StyledInput
        type="text"
        value={value}
        id={name}
        name={name}
        placeholder={placeholder}
        autoFocus={autoFocus}
        readOnly={readOnly}
        error={error}
        onChange={onChange}
      />
    </>
  );
});

export default TextInput;
