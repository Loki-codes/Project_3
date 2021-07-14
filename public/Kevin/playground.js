// d3.json("../Static/data/Predicted_Info.json").then((data, err) => {
//   if (err) throw err;

//   RAVIdiff = [12]

//   var svg = d3.select("#svg-area")
//     .append("svg")
//     .attr("height", "600")
//     .attr("width", "400");

//   // Append a rectangle and set its height in relation to the booksReadThisYear value
//   svg.append("rect")
//     .classed("bar", true) // for bonus
//     .data(RAVIdiff)
//     .attr("width", 100)
//     .attr("height", 100)
//     .attr("x", 0)
//     .attr("y", 0);

//   // making sure something shows up on console
//   console.log("RDBC")
//   // console.log(data[1].Ticker)

//   // if (data[0].Ticker != data[0].Ticker) {
//   //   console.log("no shot pal")
//   // }
//   // else {
//   //   console.log("wow such awesome")
//   // }

//   // This is work for the sector dropwdown

//   // create empty list for sectors
//   var sectorNames = []

//   // loop to pull just the sector names
//   for (var i = 0; i < data.length; i++) {
//     sectorNames.push(data[i].sector)
//   };

//   // removing duplicate names
//   let removeDuplicates = new Set(sectorNames);
//   let sectors = [...removeDuplicates]

//   // creating the dropdown with the sector names
//   d3.select("#selDataset")
//     .selectAll("#stocksss")
//     .data(sectors)
//     .enter()
//     .append("option")
//     .text(function (d) { return d })
//     .attr("value", function (d) { return d })


//   // This is work for the Ticker dropwdown

//   // create empty dictonary for ticker info
//   var tickerNames = { "": "Select Ticker" }

//   // for loop to populate the dictionary with stock ticker and name
//   for (var i = 0; i < data.length; i++) {
//     tickerNames[data[i].Ticker] = data[i].name
//   };

//   // creating ticker dropdown
//   d3.select("#selDataset2")
//     .selectAll("#JordanBelfort")
//     .data(Object.entries(tickerNames))
//     .enter()
//     .append("option")
//     .text(function (d) { return `${d[1]} (${d[0]})` })
//     .attr("value", function (d) { return d[0] })

//   //calling function when a sector is chosen
//   d3.selectAll("#selDataset").on("change", sectorChanged);

//   function sectorChanged() {

//     // selecting the sector dropdown menu
//     var dropdownMenu = d3.select("#selDataset");
//     // Assign the value of the dropdown menu option to a variable
//     var dataset = dropdownMenu.property("value");
//     // filter the entire dataset and create an array of stocks in the sector chosen
//     var filterArray = data.filter(d1 => d1.sector === dataset);

//     // console.log(filterArray)

//     // creating empty dictionary for filtered stock tickers and names
//     var tickerNames2 = { "": "Select Ticker" }

//     // loop to pull those tickers and names
//     for (var i = 0; i < filterArray.length; i++) {
//       tickerNames2[filterArray[i].Ticker] = filterArray[i].name
//     };

//     d3.select("#selDataset2").html("")

//     if (dataset === "") {
//       d3.select("#selDataset2")
//         .selectAll("#JordanBelfort")
//         .data(Object.entries(tickerNames))
//         .enter()
//         .append("option")
//         .text(function (d) { return `${d[1]} (${d[0]})` })
//         .attr("value", function (d) { return d[0] })
//     }
//     else {
//       d3.select("#selDataset2")
//         .selectAll("#JordanBelfort")
//         .data(Object.entries(tickerNames2))
//         .enter()
//         .append("option")
//         .text(function (d) { return `${d[1]} (${d[0]})` })
//         .attr("value", function (d) { return d[0] })
//     }
//   }

//   //calling function when a Ticker is chosen
//   d3.selectAll("#selDataset2").on("change", tickerChanged);

//   function tickerChanged() {

//     d3.select("#candlestick").html("");
//     d3.select("#svg-area").html("");
//     d3.select("#predictor").html("");
//     // selecting the Ticker dropdown menu
//     var dropdownMenu2 = d3.select("#selDataset2");
//     // Assign the value of the dropdown menu option to a variable
//     var dataset2 = dropdownMenu2.property("value");
//     // filter the entire dataset and create an array of the Ticker chosen
//     var filterArray2 = data.filter(d2 => d2.Ticker === dataset2);

//     var tickerForD3 = filterArray2[0].Ticker

//     console.log(tickerForD3)




//     d3.csv("../Static/data/MLData3.csv").then((plotData, err) => {

//       var singleStock = []
//       var percChange = []

//       // for (var i = 0; i < plotData.length; i++) {
//       //   if (plotData[i].Ticker == tickerForD3 && plotData[i].date == "2021-04-30" || plotData[i].date == "2021-07-01") {
//       //     // singleStock.push(plotData[i])
//       //     percChange.push(plotData[i])
//       //   }
//       //   else {
//       //     continue
//       //   }
//       // }
//       // var SStock = singleStock.slice(0).slice(-4)

//       plotData.forEach(function (d4) {
//         if (d4.Ticker == tickerForD3 && d4.date == "2021-04-30" || d4.Ticker == tickerForD3 && d4.date == "2021-07-01") {
//           if (d4.Ticker == tickerForD3 && d4.date == "2021-04-30") {
//             percChange.push(d4.opening)
//           }
//           else {
//             percChange.push(d4.closing)
//           }
//         }

//       })
//       console.log(percChange)
//       var RAVIdiff = ((percChange[1] - percChange[0]) / percChange[0]) * 100
//       RRavidiff = RAVIdiff.toFixed(2)
//       singleStock.push(RAVIdiff)
//       console.log(RAVIdiff * 100)

//       var height = 150
//       var width = 150
//       // Append the SVG wrapper to the page, set its height and width, and create a variable which references it
//       var svg = d3.select("#predictor")
//         .append("svg")
//         .attr("height", height)
//         .attr("width", width);

//       // Append a rectangle and set its height in relation to the booksReadThisYear value
//       svg.append("rect")
//         .data(singleStock)
//         .attr("width", width)
//         .attr("height", height)
//         .attr("x", 0)
//         .attr("y", 0)
//         .attr("fill", function (d) {
//           if ((d) <= -31) { return "#FF0000"; }
//           else if (((d) > -31) && (((d)) < -22)) { return "#CC0000"; }
//           else if (((d) > -22) && ((d) < -15)) { return "#990000"; }
//           else if (((d) > -15) && ((d) < 0)) { return "#971616"; }
//           else if ((d) == 0) { return "#405147"; }
//           else if (((d) > 0) && ((d) < 4)) { return "#006600"; }
//           else if ((d) > 4) { return "#009900"; };
//         })

//         svg.append("text")
//           .attr("color","white")
//           .attr("x", width /20)
//           .attr("y", height /1.8)
//           .html(`${RRavidiff}%`)










//       // // ????????????????????????????????? //








//     })
//   }
// })

d3.json("../Static/data/Predicted_Info_2.json").then((data) => {
  // empty variables to fill later
  var tickerList = []
  var dataList = []
  var dataDict = {}

  // forEach loop to pull the tickers and differences
  // between 7/2 actual opening and our predicted opening
  data.forEach(function (data) {
    // pulling original numbers
    var original = data.Opening_Original_7_2_21

    // pulling predicted numbers
    var predicted = data.Opening_Predicted_7_2_21
    
    // finding the difference
    // this is the difference in dollar amount **(comment 1 of 2)
    var difference = Math.abs(original - predicted).toFixed(2)
    // this is the difference in % **(comment 1 of 2)
    // var difference = (((predicted-original)/original)*100).toFixed(2)
    
    // making sure the difference is numeric
    difference = +difference
    
    // pushing the tickers into a list
    tickerList.push(data.Ticker)
    // pushing the diffrences into a list
    dataList.push(difference)
  })
  // for loop to put the two lists into a dictionary
  for (var i = 0; i < dataList.length; i++) {
    dataDict[tickerList[i]] = dataList[i]
  }
  // pulling the key,value pairs from the dictionary
  var dataDictKV = Object.entries(dataDict)

  // stat on our findings
  var dataMax = d3.max(dataList)
  var dataMin = d3.min(dataList)
  var dataMean = d3.mean(dataList)
  var dataMedian = d3.median(dataList)

  // for loop to find the stats
  // right now its just logging onto console
  for (var i = 0; i < dataDictKV.length; i++) {
    if (dataDictKV[i][1] === dataMax) {
      console.log(`Max Difference : ${dataDictKV[i][0]} - ${dataDictKV[i][1]}`)
    }
    if (dataDictKV[i][1] === dataMin) {
      console.log(`Min Difference : ${dataDictKV[i][0]} - ${dataDictKV[i][1]}`)
    }
  }
  // console loggin the info not needed in the for loop
  console.log(`Average Difference : ${dataMean.toFixed(2)}`)
  console.log(`Median Difference : ${dataMedian.toFixed(2)}`)
})