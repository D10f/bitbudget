import { useState, useEffect } from "react";
import { selectCurrentExpenses } from "../../features/expenses/expensesSlice";
import { useAppSelector } from "./useAppSelector";

// An expense createdAt field looks like: Sat Jun 12 2021 05:42:51
// We are only interested in the day of the week 'Sat' and day of month '12'.
const createdAtRegex = new RegExp(/^(\w{3})\s\w{3}\s(\d{2})/i);

const useExpenseFilters = () => {
  const expenses = useAppSelector(selectCurrentExpenses);
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>(
    setTimeout(() => {}, 0)
  );

  // Updates the current search term
  const setTextFilter = (term: string) => {
    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        setFilteredExpenses(filterExpenses(term));
      }, 250)
    );
  };

  useEffect(() => {
    clearTimeout(timer);
    setFilteredExpenses(expenses);
    // eslint-disable-next-line
  }, [expenses]); // including timer breaks things here.

  // Filters down expenses based on search term
  const filterExpenses = (term: string): IExpense[] => {
    const lowerCaseTerm = term.toLowerCase();
    switch (lowerCaseTerm[0]) {
      case "":
        return expenses;

      case "/":
        return expenses.filter((expense) =>
          lowerCaseTerm.slice(1).includes(expense.category.toLowerCase())
        );

      case "@":
        // Queries like "@8" should become "08" single there are not single digit days produced in regex
        const searchTermNormalized = lowerCaseTerm.slice(1).padStart(2, "0");

        return expenses.filter(
          (expense) =>
            expense &&
            expense.createdAt
              .toLowerCase()
              .match(createdAtRegex)
              ?.slice(1)
              .some((keyword) => searchTermNormalized.startsWith(keyword))
        );

      default:
        return expenses.filter(
          (expense) =>
            expense.title.toLowerCase().includes(lowerCaseTerm.slice(1)) ||
            expense.description.toLowerCase().includes(lowerCaseTerm.slice(1))
        );
    }
  };

  return {
    setTextFilter,
    filteredExpenses,
  };
};

export default useExpenseFilters;
