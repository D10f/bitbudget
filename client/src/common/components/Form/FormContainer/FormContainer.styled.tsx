import { FormEventHandler } from 'react';
import styled from 'styled-components';

interface IStyledFormProps {
  onSubmit: FormEventHandler<HTMLFormElement>
}

export const StyledForm = styled.form<IStyledFormProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2rem;
`;