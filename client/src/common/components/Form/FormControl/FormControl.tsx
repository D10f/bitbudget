import React from "react";
import { StyledControl } from "./FormControl.styled";

interface IFormControlProps {
  children: React.ReactChild | React.ReactChild[];
}

const FormControl = ({ children }: IFormControlProps) => {
  return <StyledControl aria-hidden="true">{children}</StyledControl>;
};

export default FormControl;
