import styled, { css } from 'styled-components';

interface StyledButtonProps {
  variant: string;
  disabled?: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
  display: flex;
  justify-items: flex-start;
  align-items: center;
  gap: 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  background-image: linear-gradient(
    to right bottom,
    ${({ theme }) => theme.colors.primary.light},
    ${({ theme }) => theme.colors.primary.dark}
  );
  color: ${({ theme }) => theme.colors.dark.default};
  padding: 1rem 2rem;
  filter: ${({ disabled }) => disabled ? 'grayscale(1)' : 'unset'};

  &:hover,
  &:focus {
    cursor: ${({ disabled }) => disabled ? 'regular' : 'pointer'};
    color: ${({ theme, disabled }) => disabled ? theme.colors.dark.default : theme.colors.light.default};
    background-color: ${({ theme }) => theme.colors.primary.default};
  }

  ${({ theme, variant }) =>
    variant === "link" &&
    css<StyledButtonProps>`
      padding: 0.5rem 0;
      background: none;
      color: ${({ theme, disabled }) => disabled ? theme.colors.light.darker : theme.colors.light.default};

      &:hover,
      &:focus {
        color: ${({ theme, disabled }) => disabled ? theme.colors.light.darker : theme.colors.primary.default};
        background: none;
      }

      svg {
        width: 1.6rem;
        height: 1.6rem;
        fill: ${({ theme }) => theme.colors.light.default};
      }

      @media (max-width: ${theme.breakpoints.md}) {
        font-size: 1.8rem;
      }
    `}
`;