import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Graph = ({ expenses }) => {

  const svgRef = useRef();

  useEffect(() => {
    const canvas = svgRef.current;
    const svg = d3
      .select(canvas)
      .attr('width', canvas.clientWidth)
      .attr('height', canvas.clientHeight)
    const graph = svg
      .append('g')
      .attr('transform', `translate(${canvas.clientWidth / 2}, ${canvas.clientHeight / 2})`)

    const pie = d3.pie()
      .sort(null)
      .value(d => d.amount);
    const arcPath = d3.arc()
      .outerRadius(canvas.clientHeight / 2)
      .innerRadius(canvas.clientHeight / 4)
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
    <svg ref={svgRef}></svg>
  );
};

export default Graph;
