import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = ({
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
}) => {

  let canvasRef = useRef(null);

  useEffect(() => {

    const config = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: borderWidth
        }]
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
  ]);

  return (
    <canvas ref={canvasRef}></canvas>
  );
};

// const areEqual = (prevProps, nextProps) => {
//   console.log(prevProps.legend === nextProps.legend);
//   console.log(prevProps.legend, nextProps.legend);
//   return false;
// }

export default React.memo(BarChart);
