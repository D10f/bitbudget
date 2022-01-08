import React from "react";
import { ThemeProvider } from "styled-components";

import { theme } from "@styles/theme";
import GlobalStyles from "@styles/GlobalStyles";
import { useAppSelector } from "@hooks/useAppSelector";
import Notification from "@features/notifications/Notification/Notification";

import Navbar from "@layout/Navbar/Navbar/Navbar";
import ExpenseList from "@layout/ExpenseList/ExpenseList/ExpenseList";
import Dashboard from "@layout/Dashboard/Dashboard/Dashboard";
import Welcome from "@layout/Welcome/Welcome";

const App = () => {
  const isAuthenticated = useAppSelector((state) => state.user.token);
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
