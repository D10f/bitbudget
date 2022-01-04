import styled from 'styled-components';
import Icon from '../../Icon/Icon';

interface IStyledLabelProps {
  hide?: boolean;
}

interface IStyledWrapperProps {
  error?: boolean;
}

export const StyledLabel = styled.label<IStyledLabelProps>`
  visibility: ${({ hide }) => (hide ? "hidden" : "visible")};
  height: ${({ hide }) => (hide ? "0px" : "auto")};
  margin-bottom: 1rem;
`;

export const StyledInputWrapper = styled.div<IStyledWrapperProps>`
  border: 1px solid
    ${({ theme, error }) => (error ? theme.colors.error : theme.colors.light.default)};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.dark.default};
  min-width: 30rem;
  margin-bottom: 1rem;
`;

export const StyledIcon = styled(Icon)`
  position: absolute;
  top: 4.7rem;
  right: 1.6rem;
  width: 1.6rem;
  height: 1.6rem;
  fill: ${({ theme }) => theme.colors.error};
`;