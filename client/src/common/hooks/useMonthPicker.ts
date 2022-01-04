import { useState, useEffect, useCallback } from "react";
import {
  selectFilters,
  setCurrentMonth,
} from "@features/filters/filtersSlice";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { useAppSelector } from "@hooks/useAppSelector";

/**
 * Extracts the current month/year from the current state and provides
 * functions to move forwards and backwards one month at the time
 */
export const useMonthPicker = () => {
  const dispatch = useAppDispatch();
  const { currentMonth, currentYear } = useAppSelector(selectFilters);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>(
    setTimeout(() => {}, 0)
  );

  const updateMMYY = useCallback(() => {
    dispatch(setCurrentMonth({ newMonth: month, newYear: year }));
  }, [dispatch, month, year]);

  const decreaseMonth = () => {
    clearTimeout(timer);
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const increaseMonth = () => {
    clearTimeout(timer);
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  useEffect(() => {
    setTimer(setTimeout(updateMMYY, 500));
  }, [month, year, updateMMYY]);

  return {
    month,
    year,
    decreaseMonth,
    increaseMonth,
  };
};
