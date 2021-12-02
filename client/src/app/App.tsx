import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "../common/styles/theme";
import GlobalStyles from "../common/styles/GlobalStyles";
import Navbar from "../layout/Navbar/Navbar";
import Welcome from "../layout/Welcome/Welcome";
import Notification from "../features/notifications/Notification";

const App = () => {  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Navbar />
      <Welcome />
      <Notification />
    </ThemeProvider>
  );
};

export default App;
