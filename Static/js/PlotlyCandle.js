d3.json("../Static/data/Predicted_Info.json").then((data, err) => {
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

    // selecting the Ticker dropdown menu
    var dropdownMenu2 = d3.select("#selDataset2");
    // Assign the value of the dropdown menu option to a variable
    var dataset2 = dropdownMenu2.property("value");
    // filter the entire dataset and create an array of the Ticker chosen
    var filterArray2 = data.filter(d2 => d2.Ticker === dataset2);

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
    // putting info into variable
    var _6monthHigh = Math.max(filterArray2[0].Hmo5, filterArray2[0].Hmo4, filterArray2[0].Hmo3, filterArray2[0].Hmo2, filterArray2[0].Hmo1)
    var _6monthLow = Math.max(filterArray2[0].Lmo5, filterArray2[0].Lmo4, filterArray2[0].Lmo3, filterArray2[0].Lmo2, filterArray2[0].Lmo1)
    var _6monthAvgVol = ((filterArray2[0].Vmo5 + filterArray2[0].Vmo4 + filterArray2[0].Vmo3 + filterArray2[0].Vmo2 + filterArray2[0].Vmo1) / 5)
    var _6monthPerChange = Math.round(((((filterArray2[0].Cmo1 - filterArray2[0].Omo5) / filterArray2[0].Omo5) * 100) + Number.EPSILON) * 100) / 100

    // making an info box that matches the tooltip
    d3.select(".toad").append("li").html(`<strong> Ticker:</strong> ${filterArray2[0].Ticker} <br>
        <strong> Company Name:</strong> ${filterArray2[0].name} <br>
        <strong> Sector:</strong> ${filterArray2[0].sector}<br>
        <strong> 6 Month High:</strong> ${_6monthHigh} <br>
        <strong> 6 Month Low:</strong> ${_6monthLow} <br>
        <strong> Avg. Monthly Volume:</strong> ${_6monthAvgVol} <br>
        <strong> % Change in last 6 Months:</strong> ${_6monthPerChange} <br>`)
  }

})