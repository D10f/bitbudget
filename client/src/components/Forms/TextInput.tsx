import React from "react";
import styled from "styled-components";

interface ITextInputProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  hideLabel?: boolean;
  autoFocus?: boolean;
  readOnly?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

interface IStyledLabelProps {
  hide?: boolean;
}

const StyledInput = styled.input`
  position: relative;
  margin: 1rem 0;
  padding: 1rem;
  font-size: 1.6rem;
  min-height: 4rem;
  min-width: 25rem;
  border: 1px solid ${({ theme }) => theme.colors.dark.dark};
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

const TextInput = ({
  label,
  value,
  name,
  placeholder,
  hideLabel = false,
  autoFocus = false,
  readOnly = false,
  onChange,
}: ITextInputProps) => {
  return (
    <>
      <StyledLabel htmlFor={name} hide={hideLabel}>
        {label}
      </StyledLabel>
      <StyledInput
        type="text"
        value={value}
        name={name}
        placeholder={placeholder}
        autoFocus={autoFocus}
        readOnly={readOnly}
        onChange={onChange}
      />
    </>
  );
};

export default TextInput;
