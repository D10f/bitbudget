import styled from 'styled-components';

interface ITimeTag {
  datetime: string;
}

export const StyledTimeTag = styled.time<ITimeTag>`
  font-size: 2rem;
`;

export const StyledButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.light.default};
  font-size: 2rem;

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.primary.default};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.phone}) {
    font-size: 3rem;
  }
`;