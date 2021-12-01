import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "../common/styles/theme";
import GlobalStyles from "../common/styles/GlobalStyles";
import Navbar from "../components/Navbar/Navbar";
import Welcome from "../components/Welcome/Welcome";
import Notification from "../features/ui/Notification";

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
