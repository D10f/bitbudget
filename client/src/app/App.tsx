import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "../common/styles/theme";
import { useAppSelector } from "../common/hooks/useAppSelector";
import GlobalStyles from "../common/styles/GlobalStyles";
import Navbar from "../layout/Navbar/Navbar";
import ExpenseList from "../layout/ExpenseList/ExpenseList";
import Notification from "../features/notifications/Notification";
import Dashboard from "../layout/Dashboard/Dashboard";
import Welcome2 from "../layout/Welcome/Welcome2";

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
        <Welcome2 />
      )}
    </ThemeProvider>
  );
};

export default App;
