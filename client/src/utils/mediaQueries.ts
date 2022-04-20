import { Breakpoints } from '../types.d';

export const isWindowSmallerThan = (query: Breakpoints) => {
  return window.matchMedia(`(max-width: ${query})`).matches;
};