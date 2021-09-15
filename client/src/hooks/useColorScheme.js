import { useCallback } from 'react';
import { generate } from 'patternomaly';

const tableau20 = [
  'rgba(31, 119, 180, 0.85)',
  'rgba(174, 199, 232, 0.85)',
  'rgba(255, 127, 14, 0.85)',
  'rgba(255, 187, 120, 0.85)',
  'rgba(44, 160, 44, 0.85)',
  'rgba(152, 223, 138, 0.85)',
  'rgba(214, 39, 40, 0.85)',
  'rgba(255, 152, 150, 0.85)',
  'rgba(148, 103, 189, 0.85)',
  'rgba(197, 176, 213, 0.85)',
  'rgba(140, 86, 75, 0.85)',
  'rgba(196, 156, 148, 0.85)',
  'rgba(227, 119, 194, 0.85)',
  'rgba(247, 182, 210, 0.85)',
  'rgba(127, 127, 127, 0.85)',
  'rgba(199, 199, 199, 0.85)',
  'rgba(188, 189, 34, 0.85)',
  'rgba(219, 219, 141, 0.85)',
  'rgba(23, 190, 207, 0.85)',
  'rgba(158, 218, 229, 0.85)',
];

const tableau20WithPatterns = generate(tableau20);

const useColorScheme = () => {

  // Use a generator to loop indefinitely over whatever available color schemes exist
  const schemeGenerator = (function* () {
    while(true) {
      yield tableau20;
      yield tableau20WithPatterns;
    }
  })();

  // UseCallback here prevents unwanted re-renders in the component
  const getNext = useCallback(() => schemeGenerator.next().value, []);

  // Returns an initial value, and function to return new ones on demand.
  return [ getNext(), getNext ];
};

export default useColorScheme;
