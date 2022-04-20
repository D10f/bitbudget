/**
 *  MEDIA QUERY REFERENCE
 *  | Breakpoint      | Pixels |  Em   |
 *  | --------------- | ------ | ----- |
 *  | XS              | < 400  | 25    |
 *  | Phone           | < 600  | 37.5  |
 *  | TabletPortrait  | < 768  | 48    |
 *  | TabletLandscape | < 1200 | 75    |
 *  | Desktop         | < 1800 | 112.5 |
 *  | WideScreen      | > 1800 | 112.5 |
 */
export const breakpoints = {
  xs: "25em",
  phone: "37.5em",
  tabletPortrait: "48em",
  tabletLandscape: "75em",
  desktop: "112.5em",
  widescreen: "112.5em",
};

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const tableau20 = [
  "rgba(31, 119, 180, 0.85)",
  "rgba(174, 199, 232, 0.85)",
  "rgba(255, 127, 14, 0.85)",
  "rgba(255, 187, 120, 0.85)",
  "rgba(44, 160, 44, 0.85)",
  "rgba(152, 223, 138, 0.85)",
  "rgba(214, 39, 40, 0.85)",
  "rgba(255, 152, 150, 0.85)",
  "rgba(148, 103, 189, 0.85)",
  "rgba(197, 176, 213, 0.85)",
  "rgba(140, 86, 75, 0.85)",
  "rgba(196, 156, 148, 0.85)",
  "rgba(227, 119, 194, 0.85)",
  "rgba(247, 182, 210, 0.85)",
  "rgba(127, 127, 127, 0.85)",
  "rgba(199, 199, 199, 0.85)",
  "rgba(188, 189, 34, 0.85)",
  "rgba(219, 219, 141, 0.85)",
  "rgba(23, 190, 207, 0.85)",
  "rgba(158, 218, 229, 0.85)",
];

export const API_URL = process.env.REACT_APP_API_URL as string;
