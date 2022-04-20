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

export const API_URL = process.env.REACT_APP_API_URL as string;
