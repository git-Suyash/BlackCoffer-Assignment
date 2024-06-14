import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const ScatterPlot = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const svgRef = useRef(null);
  const Url = import.meta.env.VITE_APP_API_BASE_URL + "/api/data";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(Url);

        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          throw new Error('Invalid data response');
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [Url]);

  useEffect(() => {
    if (!loading && !error && data.length > 0) {
      const svg = d3.select(svgRef.current)
        .attr('width', 1200)
        .attr('height', 800)
        .style('border', '1px solid black');

      const margin = { top: 20, right: 30, bottom: 80, left: 50 },
        width = 1200 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

      const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.intensity) || 0, d3.max(data, d => d.intensity) || 10])
        .range([margin.left, width - margin.right]);

      const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.relevance) || 0, d3.max(data, d => d.relevance) || 10])
        .range([height - margin.bottom, margin.top]);

      const colorScale = d3.scaleOrdinal()
        .domain(data.map(d => d.region))
        .range(d3.schemeCategory10);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg.selectAll("*").remove();

      svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(xAxis)
        .append('text')
        .attr('class', 'axis-title')
        .attr('x', width / 2)
        .attr('y', 50)
        .attr('fill', 'black')
        .text('Intensity');

      svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(yAxis)
        .append('text')
        .attr('class', 'axis-title')
        .attr('x', -height / 2)
        .attr('y', -40)
        .attr('transform', 'rotate(-90)')
        .attr('fill', 'black')
        .text('Relevance');

      svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.intensity))
        .attr('cy', d => yScale(d.relevance))
        .attr('r', 5)
        .attr('fill', d => colorScale(d.region));

      const legend = svg.selectAll('.legend')
        .data(colorScale.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`);

      legend.append('rect')
        .attr('x', width - 18)
        .attr('y', height + 40)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', colorScale);

      legend.append('text')
        .attr('x', width - 24)
        .attr('y', height + 49)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(d => d);
    }
  }, [data, loading, error]);

  return (
    <div id="scatter-plot">
      {loading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
      <svg ref={svgRef} />
    </div>
  );
};

export default ScatterPlot;
