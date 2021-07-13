d3.json("../Static/data/Predicted_Info_2.json").then((data, err) => {
  if (err) throw err;

  // making sure something shows up on console
  console.log("RDBC")
  
  // This is work for the sector dropwdown
  // create empty list for sectors
  var sectorNames = []

  // loop to pull just the sector names
  for (var i = 0; i < data.length; i++) {
    sectorNames.push(data[i].sector)
  };

  // removing duplicate names
  let removeDuplicates = new Set(sectorNames);
  let sectors = [...removeDuplicates]

  // creating the dropdown with the sector names
  d3.select("#selDataset")
    .selectAll("#stocksss")
    .data(sectors)
    .enter()
    .append("option")
    .text(function (d) { return d })
    .attr("value", function (d) { return d })


  // This is work for the Ticker dropwdown
  // create empty dictonary for ticker info
  var tickerNames = { "": "Select Ticker" }

  // for loop to populate the dictionary with stock ticker and name
  for (var i = 0; i < data.length; i++) {
    tickerNames[data[i].Ticker] = data[i].name
  };

  // creating ticker dropdown
  d3.select("#selDataset2")
    .selectAll("#JordanBelfort")
    .data(Object.entries(tickerNames))
    .enter()
    .append("option")
    .text(function (d) { return `${d[1]} (${d[0]})` })
    .attr("value", function (d) { return d[0] })

  // clearing infobox
  d3.select(".toad").html("");

  //calling function when a sector is chosen
  d3.selectAll("#selDataset").on("change", sectorChanged);

  function sectorChanged() {
    // selecting the sector dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");
    // filter the entire dataset and create an array of stocks in the sector chosen
    var filterArray = data.filter(d1 => d1.sector === dataset);

    // creating empty dictionary for filtered stock tickers and names
    var tickerNames2 = { "": "Select Ticker" }

    // loop to pull those tickers and names
    for (var i = 0; i < filterArray.length; i++) {
      tickerNames2[filterArray[i].Ticker] = filterArray[i].name
    };

    // clearing the ticker dropdown
    d3.select("#selDataset2").html("")

    // repopulating the ticker dropdown on that sector(all if none)
    if (dataset === "") {
      d3.select("#selDataset2")
        .selectAll("#JordanBelfort")
        .data(Object.entries(tickerNames))
        .enter()
        .append("option")
        .text(function (d) { return `${d[1]} (${d[0]})` })
        .attr("value", function (d) { return d[0] })
    }
    else {
      d3.select("#selDataset2")
        .selectAll("#JordanBelfort")
        .data(Object.entries(tickerNames2))
        .enter()
        .append("option")
        .text(function (d) { return `${d[1]} (${d[0]})` })
        .attr("value", function (d) { return d[0] })
    }
  }

  //calling function when a Ticker is chosen
  d3.selectAll("#selDataset2").on("change", tickerChanged);

  function tickerChanged() {
    // clearing visuals to be replaced
    d3.select("#my_dataviz").html("");
    d3.select("#peach").html("");
    d3.select(".toad").html("");
    d3.select("#predictor").html("");

    // selecting the Ticker dropdown menu
    var dropdownMenu2 = d3.select("#selDataset2");
    // Assign the value of the dropdown menu option to a variable
    var dataset2 = dropdownMenu2.property("value");
    // filter the entire dataset and create an array of the Ticker chosen
    var filterArray2 = data.filter(d2 => d2.Ticker === dataset2);

    var tickerForD3 = filterArray2[0].Ticker

  
    // Define SVG area dimensions
    var svgWidth = 960;
    var svgHeight = 500;

    // Define the chart's margins as an object
    var margin = {
      top: 60,
      right: 60,
      bottom: 60,
      left: 60
    };

    // Define dimensions of the chart area
    var chartWidth = svgWidth - margin.left - margin.right;
    var chartHeight = svgHeight - margin.top - margin.bottom;

    // Select body, append SVG area to it, and set its dimensions
    var svg = d3.select("body")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    // Append a group area, then set its margins
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
      
    // Configure a parseTime function which will return a new Date object from a string
    var parseTime = d3.timeParse('%Y-%m-%d');



    // this will filter the ticket, still hard coded but needs to come from the user's input --- IMPORTANT TO FIX
    var filters = {'Ticker': [tickerForD3]};

    console.log(filters);
    // Load data from forcepoints.csv
    d3.csv("../Static/data/MLData3.csv").then(function(forceData) {


      forceData = forceData.filter(function(row) {
        // run through all the filters, returning a boolean
        return ['Ticker','date','sector','name','opening','closing','next_Opening'].reduce(function(pass, column) {
            return pass && (
                // pass if no filter is set
                !filters[column] ||
                    // pass if the row's value is equal to the filter
                    // (i.e. the filter is set to a string)
                    row[column] === filters[column] ||
                    // pass if the row's value is in an array of filter values
                    filters[column].indexOf(row[column]) >= 0
                );
        }, true);
    })


      // Print the forceData NOW FILTERED According to var filters
      

      // Format the date and cast the force value to a number
      forceData.forEach(function(data) {
        data.date = parseTime(data.date);
        data.force = +data.opening;
      });




      // Configure a time scale
      // d3.extent returns the an array containing the min and max values for the property specified
      var xTimeScale = d3.scaleTime()
        .domain(d3.extent(forceData, data => data.date))
        .range([0, chartWidth]);

      // Configure a linear scale with a range between the chartHeight and 0
      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(forceData, data => data.force)])
        .range([chartHeight, 0]);

      // Create two new functions passing the scales in as arguments
      // These will be used to create the chart's axes
      var bottomAxis = d3.axisBottom(xTimeScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      // Configure a line function which will plot the x and y coordinates using our scales


      var drawLine = d3.line()
        .x(data => xTimeScale(data.date))
        .y(data => yLinearScale(data.force));

      // Append an SVG path and plot its points using the line function
      chartGroup.append("path")
        // The drawLine function returns the instructions for creating the line for forceData
        .attr("d", drawLine(forceData))
        .style("fill", "none")
        .attr("stroke", "blue")
        .classed("line", true);

      // Append an SVG group element to the chartGroup, create the left axis inside of it
      chartGroup.append("g")
        .classed("axis", true)
        .call(leftAxis);

      // Append an SVG group element to the chartGroup, create the bottom axis inside of it
      // Translate the bottom axis to the bottom of the page
      chartGroup.append("g")
        .classed("axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    }).catch(function(error) {
      console.log(error);
    });

    // putting it in local storage incase we want multi-pages
    localStorage.setItem("array", filterArray2);

    // Plotly Predicted plot
    // pulling the key,value pairs
    var FA2 = Object.entries(filterArray2[0])
    // creating plot with opening values
    var x = [FA2[3][0], FA2[8][0], FA2[13][0], FA2[18][0], FA2[23][0]]
    var y = [FA2[3][1], FA2[8][1], FA2[13][1], FA2[18][1], FA2[23][1]]
    var trace1 = [{ x: x, y: y, type: "line" }]
    var layOut = { title: `${filterArray2[0].name} (${filterArray2[0].Ticker}) Closing Price`, xaxis: { title: "Month Closing" }, yaxis: { title: "Closing Price", autorange: true, type: "linear" } };
    Plotly.newPlot("candlestick", trace1, layOut)

    // Info Box Work
    // calling the ML csv to match treemap numbers and colors
    d3.csv("../Static/data/MLData3.csv").then((plotData, err) => {

      // creating empy lists for data
      var infoBox = []
      var percChange = []

      // doing a forEach loop to get just the info for the days in the treemap % change (4/30&7/1)
      plotData.forEach(function (d4) {
        if (d4.Ticker == tickerForD3 && d4.date == "2021-04-30" || d4.Ticker == tickerForD3 && d4.date == "2021-07-01") {
          if (d4.Ticker == tickerForD3 && d4.date == "2021-04-30") {
            percChange.push(d4.opening)
          }
          else {
            percChange.push(d4.closing)
          }
        }

      })
      // doing the percent change calc and storing into a variable
      var RAVIdiff = ((percChange[1] - percChange[0]) / percChange[0]) * 100
      // pushing that into another list for correct structure
      infoBox.push(RAVIdiff)
      // rounding to 2 decimals
      RRavidiff = RAVIdiff.toFixed(2)

      // variables for height/width of info box
      var height = 150
      var width = 150

      // Appending SVG wrapper to predictor, set its height and width, and create a variable which references it
      var svg = d3.select("#predictor")
        .append("svg")
        .attr("height", height)
        .attr("width", width);

      // Append a rectangle and calling data
      svg.append("rect")
        .data(infoBox)
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0)
        // if condition to color the box to match the treemap color for that stock
        .attr("fill", function (d) {
          if ((d) <= -31) { return "#FF0000"; }
          else if (((d) > -31) && (((d)) < -22)) { return "#CC0000"; }
          else if (((d) > -22) && ((d) < -15)) { return "#990000"; }
          else if (((d) > -15) && ((d) < 0)) { return "#971616"; }
          else if ((d) == 0) { return "#405147"; }
          else if (((d) > 0) && ((d) < 4)) { return "#006600"; }
          else if ((d) > 4) { return "#009900"; };
        })

        // append the text element to the box
        svg.append("text")
          .attr("color","white")
          .attr("x", width /20)
          .attr("y", height /1.8)
          .html(`${RRavidiff}%`)
      })
  }
})
