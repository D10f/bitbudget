import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// const BarChart = ({
//   labels,
//   data,
//   onClick,
//   usePointStyle,
//   tooltipLabel,
//   tooltipTitle,
//   backgroundColor,
//   borderColor,
//   borderWidth,
//   base,
//   legend,
//   scaleX,
//   scaleY
// }) => {
const BarChart = ({
  labels,
  datasets,
  onClick,
  usePointStyle,
  tooltipLabel,
  tooltipTitle,
  base,
  legend,
  scaleX,
  scaleY
}) => {

  let canvasRef = useRef(null);


  useEffect(() => {

    // datasets: [{
    //   data: data,
    //   backgroundColor: backgroundColor,
    //   borderColor: borderColor,
    //   borderWidth: borderWidth
    // }]
    const config = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        onClick: onClick,
        plugins: {
          legend: legend,
          tooltip: {
            usePointStyle: false,
            callbacks: {
              title: tooltipTitle,
              label: tooltipLabel
            }
          }
        },
        base: base || 0,
        scales: {
          x: scaleX,
          y: scaleY
        }
      }
    };

    if (canvasRef.current.nodeName === 'CANVAS') {
      canvasRef.current = new Chart(canvasRef.current.getContext('2d'), config)
    } else {
      canvasRef.current.data = config.data;
      canvasRef.current.update();
    }

  }, [
    labels,
    datasets,
    onClick,
    usePointStyle,
    tooltipLabel,
    tooltipTitle,
    base,
    legend,
    scaleX,
    scaleY
  ]);

  return (
    <canvas ref={canvasRef}></canvas>
  );
};

/*
[
  labels,
  data,
  onClick,
  usePointStyle,
  tooltipLabel,
  tooltipTitle,
  backgroundColor,
  borderColor,
  borderWidth,
  base,
  legend,
  scaleX,
  scaleY
])
*/

// const areEqual = (prevProps, nextProps) => {
//   console.log(prevProps.legend === nextProps.legend);
//   console.log(prevProps.legend, nextProps.legend);
//   return false;
// }

export default React.memo(BarChart);
