import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const Chart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const svgRef = useRef(null);
  const Url = import.meta.env.VITE_APP_API_BASE_URL+"/api/data";
  
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
  }, []);


  useEffect(() => {
    if (!loading && !error && data.length > 0) {
      const svg = d3.select(svgRef.current)
        .attr('width', 800)
        .attr('height', 600)
        .style('border', '1px solid black');

      const margin = { top: 20, right: 30, bottom: 40, left: 90 },
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

      const x = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(data, d => d.relevance)]);

      const y = d3.scaleBand()
        .range([height, 0])
        .domain(data.map(d => d.sector))
        .padding(0.1);

      const svgContent = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      svgContent.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('width', d => x(d.relevance))
        .attr('y', d => y(d.sector))
        .attr('height', y.bandwidth())
        .attr('fill', 'steelblue');

      svgContent.append('g')
        .call(d3.axisLeft(y));

      svgContent.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));
    }
  }, [data, loading, error]);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <svg ref={svgRef}></svg>
      )}
    </>
  );
}

export default Chart;
