import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ITotalProgressProps {
  value: string;
}

export const Container = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
`;

export const SummaryContainer = styled.article`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const SummaryTitle = styled.h4`
  color: ${({ theme }) => theme.colors.light.darker};
  font-size: 1.2rem;
`;

export const SummaryInfo = styled.p`
  color: ${({ theme }) => theme.colors.light.default};
  font-size: 1.75rem;
`;

// Hidden visually but left for accessibility and semantic meaning
export const ProgressBar = styled.div`
  grid-column-start: 1;
  grid-column-end: 4;
  height: 1rem;
  background-color: #36393f;
  border: none;
`;

export const TotalProgress = styled(motion.div)<ITotalProgressProps>`
  position: relative;
  width: 100%;
  height: 1rem;
  background-image: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.primary.default},
    ${({ theme }) => theme.colors.primary.dark}
  );
  text-align: right;
  font-size: 1.25rem;

  &::after {
    content: attr(value) "%";
    position: absolute;
    right: ${({ value }) => (parseFloat(value) < 10 ? "-4rem" : "0")};
    top: 1rem;
    color: ${({ theme }) => theme.colors.light.default};
  }
`;