import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Graph = ({ expenses }) => {

  const svgRef = useRef();

  useEffect(() => {
    const canvas = svgRef.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const svg = d3
      .select(canvas)
      .attr('width', width)
      .attr('height', width)
    const graph = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${width / 2})`)
    const pie = d3.pie()
      .sort(null)
      .value(d => d.amount);
    const arcPath = d3.arc()
      .outerRadius(width / 2 - 3)
      .innerRadius(width / 4 - 3)
    const color = d3.scaleOrdinal(d3['schemeSet3'])
    color.domain(expenses.map(d => d.category))

    const angles = pie(expenses);
    const paths = graph.selectAll('path').data(angles);

    paths.enter()
      .append('path')
      .attr('stroke', '#444')
      .attr('fill', d => color(d.data.category))
      .attr('d', arcPath)
      .attr('stroke-width', 1)

  }, [expenses]);

  return (
    <svg className="summary__chart" ref={svgRef}></svg>
  );
};

export default Graph;
