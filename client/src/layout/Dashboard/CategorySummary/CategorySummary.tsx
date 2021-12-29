import React from "react";
import styled from "styled-components";
import {
  Chart as ChartJS,
  ChartData,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ChartArea,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useAppSelector } from "../../../common/hooks/useAppSelector";
import { selectAmountByCategory, selectCategoriesByName, selectTotalCategories } from "../../../features/expenses/expensesSlice";
import { selectCurrentMMYYByName } from "../../../features/filters/filtersSlice";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const CardContainer = styled.div`
  grid-area: categories;
  display: flex;
  width: 100%;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.dark.darkest};
  box-shadow: ${({ theme }) => theme.effects.shadow};
  border-radius: ${({ theme }) => theme.layout.borderRadius};
`;

const tableau20 = [
  'rgba(31, 119, 180, 0.85)',
  'rgba(174, 199, 232, 0.85)',
  'rgba(255, 127, 14, 0.85)',
  'rgba(255, 187, 120, 0.85)',
  'rgba(44, 160, 44, 0.85)',
  'rgba(152, 223, 138, 0.85)',
  'rgba(214, 39, 40, 0.85)',
  'rgba(255, 152, 150, 0.85)',
  'rgba(148, 103, 189, 0.85)',
  'rgba(197, 176, 213, 0.85)',
  'rgba(140, 86, 75, 0.85)',
  'rgba(196, 156, 148, 0.85)',
  'rgba(227, 119, 194, 0.85)',
  'rgba(247, 182, 210, 0.85)',
  'rgba(127, 127, 127, 0.85)',
  'rgba(199, 199, 199, 0.85)',
  'rgba(188, 189, 34, 0.85)',
  'rgba(219, 219, 141, 0.85)',
  'rgba(23, 190, 207, 0.85)',
  'rgba(158, 218, 229, 0.85)',
];

const CategorySummary = () => {

  const labels = useAppSelector(selectCategoriesByName);
  const categoryExpenseAmnt = useAppSelector(selectAmountByCategory);
  const currentMMYY = useAppSelector(selectCurrentMMYYByName);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Category Breakdown for ${currentMMYY}`,
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
        data: categoryExpenseAmnt,
        backgroundColor: tableau20
      },
    ],
  };

  return (
    <CardContainer>
      <Bar options={options} data={data} />
    </CardContainer>
  );
};

export default CategorySummary;
