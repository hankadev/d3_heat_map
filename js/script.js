/* global d3 */
(function () {
  'use strict';
  const colors = ['#ff6600', '#ff944d', '#ffa64d', '#ffcc66', '#ffff99', '#e6e6ff', '#ccccff', '#9999ff'];
  const texts = ['over 12°C', '10-12°C', '9-10°C', '8-9°C', '7-8°C', '6-7°C', '4-6°C', 'below 4°C']

  function getCellColor(baseTemperature, variance) {
    var temp = baseTemperature + variance;
    if (temp >= 12) {
      return colors[0];
    }
    if (temp >= 10) {
      return colors[1];
    }
    if (temp >= 9) {
      return colors[2];
    }
    if (temp >= 8) {
      return colors[3];
    }
    if (temp >= 7) {
      return colors[4];
    }
    if (temp >= 6) {
      return colors[5];
    }
    if (temp >= 4) {
      return colors[6];
    }
    else {
      return colors[7];
    }
  }

  function showTooltip(item, baseTemperature) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[item.month - 1] + ' ' + item.year + '<br />' + (baseTemperature + item.variance).toFixed(2) + '°C';
  }

  const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
  d3.json(url).then(function (data) {
    if (data && data.baseTemperature && data.monthlyVariance) {
      const baseTemperature = data.baseTemperature;
      const dataset = data.monthlyVariance;

      var descriptionEl = document.getElementById('description');
      descriptionEl.textContent = dataset[0].year + ' - ' + dataset[dataset.length - 1].year + ': base temperature ' + baseTemperature + '°C';

      const width = 900;
      const height = 500;
      const paddingW = 80;
      const paddingH = 40;

      const minDate = new Date(0, 0, 0, 0, 0, 0, 0);
      const maxDate = new Date(0, 12, 0, 0, 0, 0, 0);
      const minYear = d3.min(dataset, d => d.year);
      const maxYear = d3.max(dataset, d => d.year);

      const cellHeight = (height - 2 * paddingH) / 12;
      const cellWidth = (width - 2 * paddingW) / (maxYear - minYear);

      const xScale =
        d3.scaleLinear()
          .range([paddingW, width - paddingW])
          .domain([new Date(minYear), new Date(maxYear)]);

      const yScale =
        d3.scaleTime()
          .range([paddingH, height - paddingH])
          .domain([new Date(minDate), new Date(maxDate)]);

      // create svg element and append it to body
      const svg =
        d3.select('#canvas')
          .append('svg')
          .attr('width', width)
          .attr('height', height);

      // add tooltip 
      const tooltip =
        d3.select('#canvas')
          .append('div')
          .attr('id', 'tooltip');

      // add axis to svg canvas
      const xAxis =
        d3.axisBottom(xScale)
          .tickFormat(d3.format('d'));

      svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0,' + (height - paddingH) + ')')
        .call(xAxis);

      const yAxis =
        d3.axisLeft(yScale)
          .tickFormat(d3.timeFormat('%B'));

      svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + paddingW + ',0)')
        .call(yAxis);

      // add cells to the graph
      svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('x', d => xScale(d.year))
        .attr('y', d => yScale(new Date(0, d.month - 1, 0, 0, 0, 0, 0)))
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', cell => getCellColor(baseTemperature, cell.variance))
        .attr('data-year', d => d.year)
        .attr('data-month', d => d.month - 1)
        .attr('data-temp', d => baseTemperature + d.variance)
        .on('mouseover', d => {
          tooltip.attr('data-year', d.year)
            .html(showTooltip(d, baseTemperature))
            .style('top', (d3.event.pageY - 60) + 'px')
            .style('left', (d3.event.pageX) + 'px')
            .style('visibility', 'visible');
        })
        .on('mouseout', () => {
          tooltip.style('visibility', 'hidden');
        });

      // add legend
      const legend = d3
        .select('#legend')
        .append('svg')
        .attr('width', 150)
        .attr('height', height)

      legend
        .append('text')
        .attr('x', 0)
        .attr('y', 90)
        .style('text-anchor', 'start')
        .text('Temperature');

      for (var i = 0; i < colors.length; i++) {
        legend.append('rect')
          .attr('width', 20)
          .attr('height', 20)
          .attr('x', 0)
          .attr('y', 100 + i * 25)
          .attr('fill', colors[i]);
        legend.append('text')
          .attr('x', 25)
          .attr('y', 115 + i * 25)
          .style('text-anchor', 'start')
          .text(texts[i]);
      }
    }

  });
}());
