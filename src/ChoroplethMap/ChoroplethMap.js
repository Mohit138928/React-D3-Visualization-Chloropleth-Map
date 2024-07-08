import React from "react";
import * as d3 from "d3";

let countryURl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

const topojson = require("topojson");

let countryData;
let educationData;

let canvas = d3.select("#canvas");
let tooltip = d3.select("#tooltip");

let drawMap = () => {
  canvas
    .selectAll("path")
    .data(countryData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (countryDataItem) => {
      let id = countryDataItem["id"];
      let county = educationData.find((item) => {
        return item["fips"] === id;
      });
      let percentage = county["bachelorsOrHigher"];
      if (percentage <= 15) {
        return "#a0cffb";
      } else if (percentage <= 30) {
        return "#69b1f9";
      } else if (percentage <= 45) {
        return "#0058b2";
      } else {
        return "#003061";
      }
    })
    .attr("data-fips", (countryDataItem) => {
      return countryDataItem["id"];
    })
    .attr("data-education", (countryDataItem) => {
      let id = countryDataItem["id"];
      let county = educationData.find((item) => {
        return item["fips"] === id;
      });
      let percentage = county["bachelorsOrHigher"];
      return percentage;
    })
    .on("mouseover", (countryDataItem) => {
      tooltip.transition().style("visibility", "visible");

      let id = countryDataItem["id"];
      let name = educationData.find((item) => {
        return item["fips"] === id;
      });

      tooltip.text(
        name["fips"] +
          " - " +
          name["area_name"] +
          ", " +
          name["state"] +
          " : " +
          name["bachelorsOrHigher"] +
          "%"
      );

      tooltip.attr("data-education", name["bachelorsOrHigher"]);
    })
    .on("mouseout", (countryDataItem) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

d3.json(countryURl).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    countryData = topojson.feature(data, data.objects.counties).features;
    console.log(countryData);

    d3.json(educationURL).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        educationData = data;
        console.log(educationData);
        drawMap();
      }
    });
  }
});

const ChoroplethMap = () => {
  return (
    <>
      <h2 id="title">USA Education data</h2>
      <div id="description">
        Percentage of Peaple over 25 with a bachelors degre or higher.
      </div>
      <div id="tooltip"></div>
      <svg id="canvas"></svg>
      <svg id="legend">
        <g>
          <rect x="10" y="0" width="40" height="40" fill="#a0cffb"></rect>
          <text x="60" y="20" fill="black">
            Less than 15%
          </text>
        </g>
        <g>
          <rect x="10" y="40" width="40" height="40" fill="#69b1f9"></rect>
          <text x="60" y="60" fill="black">
            15% than 30%
          </text>
        </g>
        <g>
          <rect x="10" y="80" width="40" height="40" fill="#0058b2"></rect>
          <text x="60" y="100" fill="black">
            30% to 45%
          </text>
        </g>
        <g>
          <rect x="10" y="120" width="40" height="40" fill="#003061"></rect>
          <text x="60" y="140" fill="black">
            More than 45%
          </text>
        </g>
      </svg>
      <div className="footer">
        Created by{" "}
        <a href="https://www.linkedin.com/in/mohit-maurya-76a282204/">
          Mohit Maurya ❤️
        </a>
      </div>
    </>
  );
};

export default ChoroplethMap;
