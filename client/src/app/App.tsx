import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "../common/styles/theme";
import { useAppSelector } from "../common/hooks/useAppSelector";
import GlobalStyles from "../common/styles/GlobalStyles";
import Navbar from "../layout/Navbar/Navbar";
import ExpenseList from "../layout/ExpenseList/ExpenseList";
import Notification from "../features/notifications/Notification";
import Dashboard from "../layout/Dashboard/Dashboard";
import Welcome from "../layout/Welcome/Welcome";

const App = () => {
  const isAuthenticated = useAppSelector((state) => state.user.token);
  // const isAuthenticated = true;
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Notification />
      {isAuthenticated ? (
        <>
          <Navbar />
          <ExpenseList />
          <Dashboard />
        </>
      ) : (
        <Welcome />
      )}
    </ThemeProvider>
  );
};

export default App;
