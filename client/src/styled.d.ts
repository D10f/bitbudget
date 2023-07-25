import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: {
        default: string,
        dark: string,
        light: string,
      },
      secondary: {
        default: string,
        Dark: string,
        Light: string,
      },
      error: string,
      success: string,
      info: {},
      dark: {
        default: string,
        darker: string,
        darkest: string,
      },
      light: {
        default: string,
        darker: string,
      },
    },
    typography: {},
    layout: {
      borderRadius: string,
    },
    depth: {
      popup: number,
      modal: number,
      notifications: number,
    },
    effects: {
      shadow: string,
    },
    breakpoints: {
      xs: string,
      phone: string,
      tabletPortrait: string,
      tabletLandscape: string,
      desktop: string,
      widescreen: string,
    }
  }
}
