import React from "react";
import styled from "styled-components";
import { ChartData, TooltipItem } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useAppSelector } from "@hooks/useAppSelector";
import useExpenseFilters from "@hooks/useExpenseFilters";
import {
  selectCategoriesByName,
  selectPercentByCategory,
} from "@features/expenses/expensesSlice";
import { selectCurrentMMYYByName } from "@features/filters/filtersSlice";
import { isWindowSmallerThan } from "@utils/mediaQueries";
import { Breakpoints } from "../../../types.d";

const CardContainer = styled.div`
  width: 100%;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.dark.darkest};
  box-shadow: ${({ theme }) => theme.effects.shadow};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
`;

const tableau20 = [
  "rgba(31, 119, 180, 0.85)",
  "rgba(174, 199, 232, 0.85)",
  "rgba(255, 127, 14, 0.85)",
  "rgba(255, 187, 120, 0.85)",
  "rgba(44, 160, 44, 0.85)",
  "rgba(152, 223, 138, 0.85)",
  "rgba(214, 39, 40, 0.85)",
  "rgba(255, 152, 150, 0.85)",
  "rgba(148, 103, 189, 0.85)",
  "rgba(197, 176, 213, 0.85)",
  "rgba(140, 86, 75, 0.85)",
  "rgba(196, 156, 148, 0.85)",
  "rgba(227, 119, 194, 0.85)",
  "rgba(247, 182, 210, 0.85)",
  "rgba(127, 127, 127, 0.85)",
  "rgba(199, 199, 199, 0.85)",
  "rgba(188, 189, 34, 0.85)",
  "rgba(219, 219, 141, 0.85)",
  "rgba(23, 190, 207, 0.85)",
  "rgba(158, 218, 229, 0.85)",
];

const CategorySummary = () => {
  const labels = useAppSelector(selectCategoriesByName);
  const categoryExpenseAmnt = useAppSelector(selectPercentByCategory);
  const currentMMYY = useAppSelector(selectCurrentMMYYByName);
  const { updateSearchTerm } = useExpenseFilters();

  // TODO: Add proper typing...
  const handleClick = (...args: any) => {
    const category = args[2].tooltip.dataPoints[0].dataset.label;
    updateSearchTerm(`/${category}`);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    onClick: handleClick,
    plugins: {
      legend: {
        display: !isWindowSmallerThan(Breakpoints.PHONE),
        position: "bottom" as const,
        labels: {
          color: "rgb(255,255,255)",
        },
        onClick: () => {},
      },
      title: {
        display: true,
        text: `% Spent Per Category For ${currentMMYY}`,
        color: "rgb(255,255,255)",
      },
      tooltip: {
        callbacks: {
          title: () => "",
          label: (ctx: TooltipItem<"bar">) =>
            `${ctx.dataset.label} ${(ctx.raw as number).toFixed(2)}%`,
        },
      },
    },
    scales: {
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        min: 0,
        max: 100,
        ticks: {
          color: "rgba(255,255,255,0.8)",
          callback: (value: string | number) => value + "%",
        },
      },
    },
  };

  const data: ChartData<"bar", number[], string> = {
    labels: ["Percentage"],
    datasets: categoryExpenseAmnt.map((amount, idx) => ({
      label: labels[idx],
      data: [amount],
      backgroundColor: tableau20[idx],
    })),
  };

  return (
    <CardContainer>
      <Bar options={options} data={data} />
    </CardContainer>
  );
};

export default CategorySummary;
