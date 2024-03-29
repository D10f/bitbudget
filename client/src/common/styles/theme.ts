import { DefaultTheme } from "styled-components";
import { breakpoints } from "@constants";

export const theme: DefaultTheme = {
  colors: {
    primary: {
      default: "#FF8C00",
      dark: "#eb904a",
      light: "#ecbc37",
    },
    secondary: {
      default: "#1E90FF",
      Dark: "#1E76CC",
      Light: "#32A4FF",
    },
    error: "#e78284",
    success: "#a6d189",
    info: {},
    dark: {
      default: "#414559",
      darker: "#303446",
      darkest: "#292c3c",
    },
    light: {
      default: "#eff1f5",
      darker: "#acb0be",
    },
  },
  typography: {},
  layout: {
    borderRadius: "5px",
  },
  depth: {
    popup: 40,
    modal: 50,
    notifications: 60,
  },
  effects: {
    shadow: "0.4rem 1rem 1rem rgba(0, 0, 0, 0.25)",
  },
  breakpoints,
};

// export const theme: DefaultTheme = {
//   colors: {
//     primary: {
//       default: "#FF8C00",
//       dark: "#eb904a",
//       light: "#ecbc37",
//     },
//     secondary: {
//       default: "#1E90FF",
//       Dark: "#1E76CC",
//       Light: "#32A4FF",
//     },
//     error: "#ff5c5c",
//     success: "#39d98a",
//     info: {},
//     dark: {
//       default: "#333",
//       darker: "#2f3136",
//       darkest: "#202225",
//     },
//     light: {
//       default: "#f4f4f4",
//       darker: "#a6a6a6",
//     },
//   },
//   typography: {},
//   layout: {
//     borderRadius: "5px",
//   },
//   depth: {
//     popup: 40,
//     modal: 50,
//     notifications: 60,
//   },
//   effects: {
//     shadow: "0.4rem 1rem 1rem rgba(0, 0, 0, 0.25)",
//   },
//   breakpoints,
// };
