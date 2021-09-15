import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DoughnutChart = ({
  labels,
  data,
  onClick,
  tooltipLabel,
  tooltipTitle,
  backgroundColor,
  borderColor,
  legend
}) => {

  let canvasRef = useRef(null);

  useEffect(() => {

    const config = {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 2
        }]
      },
      options: {
        onClick: onClick,
        plugins: {
          legend: legend,
          tooltip: {
            callbacks: {
              title: tooltipTitle,
              label: tooltipLabel
            }
          }
        }
      }
    };

    if (canvasRef.current.nodeName === 'CANVAS') {
      canvasRef.current = new Chart(canvasRef.current.getContext('2d'), config)
    } else {
      canvasRef.current.data = config.data;
      canvasRef.current.update();
    }

  }, [labels, data, onClick, tooltipLabel, tooltipTitle, backgroundColor, borderColor, legend]);

  return (
    <canvas ref={canvasRef}></canvas>
  );
};

// const areEqual = (prevProps, nextProps) => {
//   console.log(prevProps.legend === nextProps.legend);
//   console.log(prevProps.legend, nextProps.legend);
//   return false;
// }

export default React.memo(DoughnutChart);
