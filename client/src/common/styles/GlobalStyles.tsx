import { createGlobalStyle } from "styled-components";

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
  }

  main {
    display: flex;
    gap: 4rem;
    /* display: grid; */
    /* grid-template:
      "navbar expenses stats" auto /
      auto    1fr      3fr; */
    position: relative;
    padding: 2rem;
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