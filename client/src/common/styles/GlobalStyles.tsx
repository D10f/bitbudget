import { createGlobalStyle } from "styled-components";
import { breakpoints } from '@constants';

const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
  }

  html {
    font-size: 62.5%;
  }

  body {
    font-family: sans-serif;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 1.6;
    background-color: #36393f;
    color: #f4f4f4;
    box-sizing: border-box;
    overflow: hidden;

    @media (max-width: ${breakpoints.tabletLandscape}) {
      overflow: unset;
      overflow-x: hidden;
    };
  }

  /* Main Layout */
  main {
    position: relative;
    height: 100vh;
    padding: 2rem;
    gap: 2rem;
    display: grid;
    grid-template:
      "navbar expenses dashboard" auto /
      auto    3fr      4fr;
    
    @media (max-width: ${breakpoints.tabletLandscape}) {
      grid-template:
      "navbar" auto
      "dashboard" auto
      "expenses" auto /
      100%;
      height: unset;
    };
  }

  ul {
    list-style: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  canvas {
    &:hover {
      cursor: pointer;
    }
  }

  input,
  button {
    font-family: inherit;
  }

  input,
  button,
  a {
    outline: none;
  }
`;

export default GlobalStyles;
