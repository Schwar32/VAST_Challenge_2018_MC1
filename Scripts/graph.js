const WIDTH = 650;
const HEIGHT = 650;
const PADDING = 0;

const MIN_X = 0;
const MAX_X = 200;
const MIN_Y = 0;
const MAX_Y = 200;

const DUMPSITE_X = 148;
const DUMPSITE_Y = 159;
const DUMPSITE_SIZE = 50;

const RADIUS = 9;

const BIRD_COLORS = {
  "Bent-beak Riffraff": "#9c27b0",
  "Blue-collared Zipper": "#f44336",
  Bombadil: "#e81e63",
  "Broad-winged Jojo": "#673ab7",
  "Canadian Cootamum": "#3f51b5",
  "Carries Champagne Pipit": "#2196f3",
  "Darkwing Sparrow": "#03a9f4",
  "Eastern Corn Skeet": "#00bcd4",
  "Green-tipped Scarlet Pipit": "#009688",
  "Lesser Birchbeere": "#4caf50",
  "Orange Pine Plover": "#8bc34a",
  "Ordinary Snape": "#cddc39",
  Pinkfinch: "#ffeb3b",
  "Purple Tooting Tout": "#ffc107",
  Qax: "#ff9800",
  Queenscoat: "#ff5722",
  "Rose-crested Blue Pipit": "#795548",
  "Scrawny Jay": "#9e9e9e",
  "Vermillion Trillian": "#607d8b",
};

let startFilter = Date.parse("01/01/1980");
let endFilter = Date.parse("01/01/2020");

let birdFilters = {
  "Bent-beak Riffraff": true,
  "Blue-collared Zipper": true,
  Bombadil: true,
  "Broad-winged Jojo": true,
  "Canadian Cootamum": true,
  "Carries Champagne Pipit": true,
  "Darkwing Sparrow": true,
  "Eastern Corn Skeet": true,
  "Green-tipped Scarlet Pipit": true,
  "Lesser Birchbeere": true,
  "Orange Pine Plover": true,
  "Ordinary Snape": true,
  Pinkfinch: true,
  "Purple Tooting Tout": true,
  Qax: true,
  Queenscoat: true,
  "Rose-crested Blue Pipit": true,
  "Scrawny Jay": true,
  "Vermillion Trillian": true,
};

const TOOLTIP_X_OFFSET = 10;
const TOOLTIP_Y_OFFSET = -45;

let xScale = d3.scale
  .linear()
  .domain([MIN_X, MAX_X])
  .range([PADDING, WIDTH - PADDING * 2]);

let yScale = d3.scale
  .linear()
  .domain([MIN_Y, MAX_Y])
  .range([HEIGHT - PADDING, PADDING]);

let svg = d3
  .select("#graph-container")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

function SetupFilters() {
  var dumpsite = document.getElementById("dumpsite-checkbox");
  dumpsite.onchange = (e) => {
    if (e.currentTarget.checked) {
      ShowDumpsite();
    } else {
      HideDumpsite();
    }
  };

  var startDate = document.getElementById("start");
  var endDate = document.getElementById("end");
  startDate.onchange = (e) => {
    var split = e.currentTarget.value.split("-");
    var formatted = split[1] + "/" + split[2] + "/" + split[0];
    startFilter = Date.parse(formatted);
    UpdateGraph();
  };
  endDate.onchange = (e) => {
    var split = e.currentTarget.value.split("-");
    var formatted = split[1] + "/" + split[2] + "/" + split[0];
    endFilter = Date.parse(formatted);
    UpdateGraph();
  };
  var container = document.getElementById("bird-filter-container");
  for (var birdName in birdFilters) {
    var btn = document.createElement("div");
    btn.className = "bird-filter active";
    btn.textContent = birdName;
    btn.id = birdName;

    btn.onclick = (e) => {
      if (birdFilters[e.currentTarget.id]) {
        e.currentTarget.className = "bird-filter inactive";
      } else {
        e.currentTarget.className = "bird-filter active";
      }
      birdFilters[e.currentTarget.id] = !birdFilters[e.currentTarget.id];
      UpdateGraph();
    };
    container.append(btn);
  }
}

function ReadCSV() {
  var data = [];
  d3.csv("../Data/AllBirdsv4.csv", function (d) {
    for (var i = 0; i < d.length; i++) {
      data.push([
        parseInt(d[i].X),
        parseInt(d[i].Y),
        d[i].English_name,
        d[i].File_ID,
        d[i].Date,
        Date.parse(d[i].Date),
      ]);
    }
    var tooltip = d3
      .select("#graph-container")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");

    var path = svg
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "test")
      .attr("r", RADIUS)
      .attr("cx", function (d) {
        return xScale(d[0]);
      })
      .attr("cy", function (d) {
        return yScale(d[1]);
      })
      .attr("fill", function (d) {
        return BIRD_COLORS[d[2]];
      })
      .attr("stroke-width", 2)
      .attr("stroke", "#000")
      .on("mouseover", function (d, i) {
        tooltip.style("opacity", 1);
        d3.select(this).attr("stroke-width", 4);
      })
      .on("mouseout", function (d, i) {
        tooltip.style("opacity", 0);
        d3.select(this).attr("stroke-width", 2);
      })
      .on("mousemove", function (d) {
        tooltip
          .html(
            "<p>" + d[2] + "</p> <p>" + "(" + d[0] + ", " + d[1] + ")" + "</p> "
          )
          .style(
            "left",
            parseInt(d3.select(this).attr("cx")) +
              document.getElementById("graph-container").offsetLeft +
              TOOLTIP_X_OFFSET +
              "px"
          )
          .style(
            "top",
            parseInt(d3.select(this).attr("cy")) +
              document.getElementById("graph-container").offsetTop +
              TOOLTIP_Y_OFFSET +
              "px"
          );
      })
      
      .on("click", function (d) {
        console.log("CLICKED,  " + d);
        const X_COORD_DIFF = DUMPSITE_X-d[0];
        const Y_COORD_DIFF = DUMPSITE_Y-d[1];
        d3.selectAll('.content-name')
          .text(d[2])
        d3.selectAll('.content-date')
          .text(d[4])
        d3.selectAll('.content-distance')
          .text(Math.round(Math.sqrt((Math.pow(X_COORD_DIFF,2))+(Math.pow(Y_COORD_DIFF,2)))))
      });

    var img = svg
      .append("image")
      .attr("xlink:href", "../Data/Images/Landfill.png")
      .attr("width", DUMPSITE_SIZE)
      .attr("height", DUMPSITE_SIZE)
      .attr("x", xScale(DUMPSITE_X) - DUMPSITE_SIZE / 2)
      .attr("y", yScale(DUMPSITE_Y) - DUMPSITE_SIZE / 2);
  });

}

function HideDumpsite() {
  svg.select("image").attr("display", "none");
}

function ShowDumpsite() {
  svg.select("image").attr("display", "block");
}

function ToggleDumpsite(e) {
  console.log("TEST");
}

function UpdateGraph() {
  svg.selectAll("circle").attr("display", function (d) {
    if (birdFilters[d[2]]) {
      if (startFilter <= d[5] && endFilter >= d[5]) {
        return "block";
      } else {
        return "none";
      }
    } else {
      return "none";
    }
  });
}


SetupFilters();
ReadCSV();
