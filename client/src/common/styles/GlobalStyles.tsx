import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

  @font-face {
    font-family: 'PanameraRegular';
    src: url(fonts/PanameraRegular.otf) format('opentype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'BarlowRegular';
    src: url(fonts/barlow.regular.ttf) format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'BarlowMedium';
    src: url(fonts/barlow.medium.ttf) format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'CatamaranRegular';
    src: url(fonts/catamaran.regular.ttf) format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'CatamaranMedium';
    src: url(fonts/catamaran.medium.ttf) format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'RalewayRegular';
    src: url(fonts/raleway.regular.ttf) format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
    font-family: inherit;
  }

  html {
    font-size: 62.5%;
  }

  body {
    font-family: BarlowMedium, sans-serif;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 1.6;
    // background-color: #36393f;
    background-color: ${({ theme }) => theme.colors.dark.default};
    color: ${({ theme }) => theme.colors.light.default};
    box-sizing: border-box;
    overflow: hidden;

    @media (max-width: ${({theme}) => theme.breakpoints.tabletLandscape}) {
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

    @media (max-width: ${({theme}) => theme.breakpoints.tabletLandscape}) {
      grid-template:
      "navbar" auto
      "dashboard" auto
      "expenses" auto /
      100%;
      height: unset;
    };

    @media (max-width: ${({theme}) => theme.breakpoints.phone}) {
      padding: 0.5rem;
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
