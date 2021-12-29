import { ChartArea } from "chart.js";

export const createGradient = (ctx: CanvasRenderingContext2D, area: ChartArea) => {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
  gradient.addColorStop(0, "#eb904a"); // primary dark
  gradient.addColorStop(0.5, "#FF8C00"); // primary default
  gradient.addColorStop(1, "#ecbc37"); // primary light
  return gradient;
};