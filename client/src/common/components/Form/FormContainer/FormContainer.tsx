import React, { FormEventHandler } from "react";
import { StyledForm } from "./FormContainer.styled";

interface IFormContainer {
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: React.ReactChild | React.ReactChild[];
}

const FormContainer = ({ onSubmit, children }: IFormContainer) => (
  <StyledForm onSubmit={onSubmit}>{children}</StyledForm>
);

export default FormContainer;
