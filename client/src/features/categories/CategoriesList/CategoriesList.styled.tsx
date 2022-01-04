import styled from "styled-components";

export const CategoryInput = styled.input`
  background: none;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.dark.default};
  width: 100%;
  background: none;
  color: inherit;
  font-size: 2rem;
  padding: 1rem;
  text-align: center;
`;

export const CategoryList = styled.ul`
  max-width: 50rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 3rem 0;
`;

export const CategoryTag = styled.li`
  font-size: 1.4rem;
  display: inline-block;
  padding: 0.4rem 0.4rem 0.4rem 0.8rem;
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  background-color: ${({ theme }) => theme.colors.light.default};
  color: ${({ theme }) => theme.colors.dark.default};

  &:hover {
    background-color: none;
    background-image: linear-gradient(
      to right bottom,
      ${({ theme }) => theme.colors.primary.light},
      ${({ theme }) => theme.colors.primary.dark}
    );
    color: ${({ theme }) => theme.colors.light.default};
    cursor: default;
  }

  &:hover span {
    opacity: 1;
  }
`;

export const DeleteButton = styled.span`
  padding: 0.5rem;
  opacity: 0.5;
  
  &:hover {
    color: ${({ theme }) => theme.colors.dark.default};
    cursor: pointer;
  }
`;