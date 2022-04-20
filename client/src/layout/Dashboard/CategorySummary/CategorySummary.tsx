import React from "react";
import styled from "styled-components";
import { ChartData, TooltipItem } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useAppSelector } from "@hooks/useAppSelector";
import useExpenseFilters from "@hooks/useExpenseFilters";
import useMediaQuery from '@hooks/useMediaQuery';
import {
  selectCategoriesByName,
  selectPercentByCategory,
} from "@features/expenses/expensesSlice";
import { selectCurrentMMYYByName } from "@features/filters/filtersSlice";
import { Breakpoints } from "@enums";
import { tableau20 } from '@constants';

const CardContainer = styled.div`
  width: 100%;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.dark.darkest};
  box-shadow: ${({ theme }) => theme.effects.shadow};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
`;

const CategorySummary = () => {
  const labels = useAppSelector(selectCategoriesByName);
  const categoryExpenseAmnt = useAppSelector(selectPercentByCategory);
  const currentMMYY = useAppSelector(selectCurrentMMYYByName);
  const { updateSearchTerm } = useExpenseFilters();

  const isViewPortPhone = useMediaQuery(`(max-width: ${Breakpoints.PHONE})`);

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
        display: !isViewPortPhone,
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
