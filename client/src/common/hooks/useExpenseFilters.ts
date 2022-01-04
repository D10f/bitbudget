import { useState, useEffect, useCallback } from "react";
import { selectCurrentExpenses } from "@features/expenses/expensesSlice";
import {
  selectSearchText,
  setTextFilter,
} from "@features/filters/filtersSlice";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { useAppSelector } from "@hooks/useAppSelector";

// An expense createdAt field looks like: Sat Jun 12 2021 05:42:51
// We are only interested in the day of the week 'Sat' and day of month '12'.
const createdAtRegex = new RegExp(/^(\w{3})\s\w{3}\s(\d{2})/i);

const DELAY = 250;

const useExpenseFilters = () => {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector(selectCurrentExpenses);
  const searchText = useAppSelector(selectSearchText);
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>(
    setTimeout(() => {}, 0)
  );

  // Filters down expenses based on search term
  const filterExpenses = useCallback(
    (term: string): IExpense[] => {
      const lowerCaseTerm = term.toLowerCase();
      switch (lowerCaseTerm[0]) {
        case "":
          return expenses;

        case "/":
          return expenses.filter((expense) =>
            lowerCaseTerm.slice(1).includes(expense.category.toLowerCase())
          );

        case "@":
          // Queries like "@8" become "08"
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
    },
    [expenses]
  );

  const updateSearchTerm = (text: string) => {
    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        dispatch(setTextFilter(text));
      }, DELAY)
    );
  };

  useEffect(() => {
    setFilteredExpenses(filterExpenses(searchText));
  }, [expenses, searchText, filterExpenses]);

  return {
    updateSearchTerm,
    filteredExpenses,
  };
};

export default useExpenseFilters;
