import React from "react";
import {
  StyledLabel,
  StyledSelectInput,
  SelectInputToggleIcon,
} from "./SelectInput.styled";

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
