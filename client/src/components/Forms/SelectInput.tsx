import React from "react";
import styled from "styled-components";

interface ISelectInputProps {
  label: string;
  name: string;
  value: string;
  readOnly?: boolean;
  hideLabel?: boolean;
  options: string[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

interface IStyledLabelProps {
  hide?: boolean;
}

const StyledSelectInput = styled.select`
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
`;

const StyledLabel = styled.label<IStyledLabelProps>`
  visibility: ${({ hide }) => (hide ? "hidden" : "visible")};
  height: ${({ hide }) => (hide ? "0px" : "auto")};
`;

const SelectInput = ({
  label,
  value,
  name,
  hideLabel = false,
  options,
  onChange,
}: ISelectInputProps) => {
  return (
    <>
      <StyledLabel htmlFor={name} hide={hideLabel}>
        {label}
      </StyledLabel>
      <StyledSelectInput
        value={value || options[0]}
        name={name}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </StyledSelectInput>
    </>
  );
};

export default SelectInput;
