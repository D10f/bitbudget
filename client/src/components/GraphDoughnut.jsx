import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const GraphDoughnut = ({ data, labels, title }) => {

  const canvasRef = useRef(null);

  useEffect(() => {
    const config = {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'My First Dataset',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
          hoverOffset: 4
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
    new Chart(canvasRef.current.getContext('2d'), config);
  }, [data]);

  return (
    <div className="summary__chart">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default GraphDoughnut;
