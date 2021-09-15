import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineChart = ({
  labels,
  datasets,
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
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        elements: {
          point: {
            radius: 2,
          }
        },
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

export default React.memo(LineChart);
