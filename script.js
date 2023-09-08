const w = 800;
const h = 600;
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

function createScatterplotGraph(data) {
  d3.select("body")
    .append("h2")
    .attr("id", "title")
    .text("Doping in Professional Bicycle Racing By G.Stam");

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip")
    .text("");

  const padding = 60;
  const minYear = d3.min(data, (d) => d["Year"]);
  const maxYear = d3.max(data, (d) => d["Year"]);

  const minDate = d3.min(data, (d) => d["Seconds"] * 1000);
  const maxDate = d3.max(data, (d) => d["Seconds"] * 1000);

  const xScale = d3
    .scaleLinear()
    .domain([minYear - 1, maxYear + 1])
    .range([padding, w - padding]);
  const yScale = d3
    .scaleTime()
    .domain([new Date(maxDate), new Date(minDate)])
    .range([h - padding, padding]);

  const xAxis = d3.axisBottom(xScale);
  xAxis.tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale);
  yAxis.tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .attr("id", "x-axis")
    // .attr("transform", "translate(0, " + (h - padding) + ")")
    .attr("transform", `translate(0,  ${h - padding})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding},0)`)
    .call(yAxis);

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", "5")
    .attr("data-xvalue", (d) => {
      return d["Year"];
    })
    .attr("data-yvalue", (d) => {
      return new Date(d["Seconds"] * 1000);
    })
    .attr("cx", (d) => {
      return xScale(d["Year"]);
    })
    .attr("cy", (d) => {
      return yScale(new Date(d["Seconds"] * 1000));
    })
    .attr("fill", (d) => (d.Doping ? "#bf0000" : "#4ca64c"))
    .on("mouseover", (d) => {
      tooltip
        .transition()
        .text(
          `Year: ${d["Year"]}
      Name:${d["Name"]},
        Event: ${d["Doping"]}`
        )

        // .attr(
        //   "style",
        //   "left:" + xScale(d["Year"]) + "px;",
        //   "top:" + yScale(new Date(d["Seconds"] * 1000) + "px;")
        // )
        // .style("left", `${xScale(d["Year"])}px`)
        // .style("top", `${yScale(new Date(d["Seconds"]) * 1000)}px`)
        .style("left", `${d3.event.x}px`)
        .style("top", `${d3.event.y}px`)
        .duration(200)
        .style("opacity", "1")
        .attr("data-year", d["Year"]);
    })

    .on("mouseout", (d) => {
      tooltip.transition().duration(300).style("opacity", "0");
    });

  d3.select("body")
    .append("div")
    .attr("id", "legend")
    .text("Year (x) vs Time (y)")
    .attr("class", "legend");
}

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    createScatterplotGraph(data);
  });
