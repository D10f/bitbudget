import React, { useRef } from "react";
import styled from "styled-components";
import {
  Chart as ChartJS,
  ChartData,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useAppSelector } from "../../../common/hooks/useAppSelector";
import {
  selectCurrentMMYYByName,
  selectLabeledDaysInMonth,
} from "../../../features/filters/filtersSlice";
import { selectAmountByDay } from "../../../features/expenses/expensesSlice";
import { createGradient } from "../../../utils/chartGradient";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const Card = styled.article`
  width: 100%;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.dark.darkest};
  box-shadow: ${({ theme }) => theme.effects.shadow};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
`;

const DailyExpenses = () => {
  const labels = useAppSelector(selectLabeledDaysInMonth);
  const currentMMYY = useAppSelector(selectCurrentMMYYByName);
  const [dailyExpenses] = useAppSelector(selectAmountByDay);
  const chartRef = useRef<ChartJS<"bar">>(null);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Daily Expenses For ${currentMMYY}`,
        color: "rgb(255,255,255)",
      },
    },
    elements: {
      bar: {
        backgroundColor: "rgb(255,255,255)",
        borderColor: "rgb(255,255,255)",
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255,255,255, 0.2)",
        },
        ticks: {
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
