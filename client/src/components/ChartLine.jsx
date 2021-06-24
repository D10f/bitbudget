import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartLine = ({ data, labels, title }) => {

  const canvasRef = useRef(null);

  useEffect(() => {
    const config = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Expenses this month',
          data: data,
          borderColor: document.querySelector(':root').style.getPropertyValue('--primary'),
          borderWidth: 2,
          fill: false,
          tension: 0.2
        }]
      },
      options: {
        layout: {
          padding: 10,
        },
        plugins: {
          title: {
            display: true,
            text: title
          },
          legend: {
            display: false
          }
        }
      }
    };

    if (canvasRef.current) {
      new Chart(canvasRef.current.getContext('2d'), config);
      canvasRef.current = null;
    }

  }, [canvasRef.current, data, labels, title]);

  return (
    <div className="summary__linechart">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default ChartLine;
