import React, { useRef } from "react";
import styled from "styled-components";
import { Chart as ChartJS, ChartData, TooltipItem } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useAppSelector } from "../../../common/hooks/useAppSelector";
import {
  selectCurrentMMYYByName,
  selectLabeledDaysInMonth,
} from "../../../features/filters/filtersSlice";
import { selectAmountByDay } from "../../../features/expenses/expensesSlice";
import { createGradient } from "../../../utils/chartGradient";
import { selectCurrentWallet } from "../../../features/wallets/walletsSlice";

const Card = styled.article`
  width: 100%;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.dark.darkest};
  box-shadow: ${({ theme }) => theme.effects.shadow};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
`;

const DailyExpenses = () => {
  const { currency } = useAppSelector(selectCurrentWallet);
  const labels = useAppSelector(selectLabeledDaysInMonth);
  const currentMMYY = useAppSelector(selectCurrentMMYYByName);
  const [dailyExpenses] = useAppSelector(selectAmountByDay);
  const chartRef = useRef<ChartJS<"bar">>(null);

  const tooltipTitle = (ctx: TooltipItem<"bar">[]) => {
    const dayOfMonth = ctx[0].label.replace(/^0/, "");
    const lastDigit = dayOfMonth[dayOfMonth.length - 1];
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

  const tooltipLabel = (ctx: TooltipItem<"bar">) => {
    const amount = ctx.raw as string;
    return `${amount} ${currency}`;
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Daily Expenses For ${currentMMYY}`,
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
          callback: (value: string | number) => `${value} ${currency}`,
          color: "rgba(255,255,255,0.8)",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255,255,255,0.8)",
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
