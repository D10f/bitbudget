import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Graph = ({ expenses }) => {

  const canvasRef = useRef(null);

  useEffect(() => {

  }, [expenses]);

  return (
    <div className="summary__chart">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default Graph;
