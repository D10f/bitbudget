import React from "react";
import styled from "styled-components";

interface ISelectInputProps {
  label: string;
  name: string;
  value: string;
  error?: boolean;
  readOnly?: boolean;
  hideLabel?: boolean;
  options: string[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

interface IStyledLabelProps {
  hide?: boolean;
}

interface IStyledSelectProps {
  error?: boolean;
}

const StyledSelectInput = styled.select<IStyledSelectProps>`
  position: relative;
  appearance: none;
  margin: 1rem 0;
  padding: 1rem;
  font-size: 1.6rem;
  min-width: 30rem;
  border: 1px solid
    ${({ theme, error }) => (error ? "red" : theme.colors.dark.dark)};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  background: ${({ theme }) => theme.colors.dark.default};
  color: ${({ theme }) => theme.colors.light.default};

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.primary.default};
  }
`;

const SelectInputToggleIcon = styled.span`
  position: absolute;
  left: 90%;
  bottom: 4.8rem;
  font-size: 2rem;
  height: 0;

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.primary.default};
  }
`;

const StyledLabel = styled.label<IStyledLabelProps>`
  visibility: ${({ hide }) => (hide ? "hidden" : "visible")};
  height: ${({ hide }) => (hide ? "0px" : "auto")};
`;

const SelectInput = React.forwardRef(
  (
    {
      label,
      value,
      name,
      options,
      error = false,
      hideLabel = false,
      onChange,
    }: ISelectInputProps,
    ref
  ) => {
    return (
      <>
        <StyledLabel htmlFor={name} hide={hideLabel}>
          {label}
        </StyledLabel>
        <StyledSelectInput
          value={value || options[0]}
          name={name}
          onChange={onChange}
          error={error}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </StyledSelectInput>
        <SelectInputToggleIcon>&lsaquo;</SelectInputToggleIcon>
      </>
    );
  }
);

export default SelectInput;
