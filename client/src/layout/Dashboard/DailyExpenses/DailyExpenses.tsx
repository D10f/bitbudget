import React, { useRef } from "react";
import styled from "styled-components";
import { Chart as ChartJS, ChartData, TooltipItem } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useAppSelector } from "@hooks/useAppSelector";
import useExpenseFilters from "@hooks/useExpenseFilters";
import {
  selectCurrentMMYYByName,
  selectLabeledDaysInMonth,
} from "@features/filters/filtersSlice";
import { selectAmountByDay } from "@features/expenses/expensesSlice";
import { selectCurrentWallet } from "@features/wallets/walletsSlice";
import { createGradient } from "@utils/chartGradient";

const Card = styled.article`
  width: 100%;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.dark.darkest};
  box-shadow: ${({ theme }) => theme.effects.shadow};
  border-radius: ${({ theme }) => theme.layout.borderRadius};

  @media (max-width: ${({theme}) => theme.breakpoints.phone}) {
    padding: 0.5rem;
  }
`;

const tooltipTitle = (ctx: TooltipItem<"bar">[]) => {
  const dayOfMonth = ctx[0].label.replace(/^0/, "");
  return sufixDayOfMonth(dayOfMonth);
};

const scaleXLabel = (value: string | number) => {
  const dayOfMonth = value.toString();
  return sufixDayOfMonth(dayOfMonth);
};

const sufixDayOfMonth = (dayOfMonth: string) => {
  const lastDigit = dayOfMonth[dayOfMonth.length - 1];

  if (dayOfMonth.length === 2 && dayOfMonth[0] === "1") {
    return dayOfMonth + "th";
  }

  switch (lastDigit) {
    case "1":
      return dayOfMonth + "st";
    case "2":
      return dayOfMonth + "nd";
    case "3":
      return dayOfMonth + "rd";
    default:
      return dayOfMonth + "th";
  }
};

const DailyExpenses = () => {
  const { currency } = useAppSelector(selectCurrentWallet);
  const labels = useAppSelector(selectLabeledDaysInMonth);
  const currentMMYY = useAppSelector(selectCurrentMMYYByName);
  const [dailyExpenses] = useAppSelector(selectAmountByDay);
  const chartRef = useRef<ChartJS<"bar">>(null);
  const { updateSearchTerm } = useExpenseFilters();

  const tooltipLabel = (ctx: TooltipItem<"bar">) => {
    const amount = ctx.raw as string;
    return `${amount} ${currency}`;
  };

  // TODO: Add proper typing...
  const handleClick = (...args: any) => {
    const dayOfMonth = args[2].tooltip.dataPoints[0].label;
    updateSearchTerm(`@${dayOfMonth}`);
  };

  const options = {
    responsive: true,
    onClick: handleClick,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Daily Expenses For ${currentMMYY} ( ${currency} )`,
        color: "rgb(255,255,255)",
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: tooltipTitle,
          label: tooltipLabel,
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255,255,255, 0.2)",
        },
        ticks: {
          color: "rgba(255,255,255,0.8)",
          callback: (value: string | number) => `${value}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
        min: 1,
        max: 31,
        ticks: {
          color: "rgba(255,255,255,0.8)",
          callback: scaleXLabel,
        },
      },
    },
  };

  const data: ChartData<"bar", number[], string> = {
    labels,
    datasets: [
      {
        data: dailyExpenses,
        backgroundColor: chartRef.current
          ? createGradient(chartRef.current.ctx, chartRef.current.chartArea)
          : "rgb(255, 140, 0)",
      },
    ],
  };

  return (
    <Card>
      <Bar ref={chartRef} options={options} data={data} />
    </Card>
  );
};

export default DailyExpenses;
