d3.json("../Static/data/stockInfo.json").then((data, err) => {
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
  
    //calling function when a sector is chosen
    d3.selectAll("#selDataset").on("change", sectorChanged);
  
    function sectorChanged() {
  
      // selecting the sector dropdown menu
      var dropdownMenu = d3.select("#selDataset");
      // Assign the value of the dropdown menu option to a variable
      var dataset = dropdownMenu.property("value");
      // filter the entire dataset and create an array of stocks in the sector chosen
      var filterArray = data.filter(d1 => d1.sector === dataset);
  
      console.log(filterArray)
  
      // creating empty dictionary for filtered stock tickers and names
      var tickerNames2 = { "": "Select Ticker" }
  
      // loop to pull those tickers and names
      for (var i = 0; i < filterArray.length; i++) {
        tickerNames2[filterArray[i].Ticker] = filterArray[i].name
      };
  
      d3.select("#selDataset2").html("")
  
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
      // selecting the Ticker dropdown menu
      var dropdownMenu2 = d3.select("#selDataset2");
      // Assign the value of the dropdown menu option to a variable
      var dataset2 = dropdownMenu2.property("value");
      // filter the entire dataset and create an array of the Ticker chosen
      var filterArray2 = data.filter(d2 => d2.Ticker === dataset2);
  
      console.log(filterArray2)
  
      localStorage.setItem("array", filterArray2);
  
      var y = [filterArray2[0].Omo1, filterArray2[0].Omo2, filterArray2[0].Omo3]
  
      var trace1 = [{x: [1, 2, 3], y: y, type: "line"}]

      var layOut = {title: `${filterArray2[0].name} (${filterArray2[0].Ticker}) Closing Price`,xaxis: {title: "Month Closing"},yaxis: {title: "Closing Price",autorange: true,type: "linear"}};
  
      Plotly.newPlot("candlestick", trace1, layOut)
    }
  
  })