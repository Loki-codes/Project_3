d3.json("../Static/data/stockInfo.json").then((data, err) => {
    if (err) throw err;

    // making sure something shows up on console
    console.log("RDBC")

    // This is work for the sector dropwdown

    // create empty list for sectors
    var sectorNames = []
    
    // loop to pull just the sector names
    for (var i=0;i<data.length;i++) {
        sectorNames.push(data[i].sector)
    };

    // removing duplicate names
    let removeDuplicates = new Set(sectorNames);
    let sectors = [ ...removeDuplicates ]
    
    // creating the dropdown with the sector names
    d3.select("#selDataset")
            .selectAll("#stocksss")
            .data(sectors)
            .enter()
            .append("option")
            .text( function (d) {return d})
            .attr("value", function (d) {return d})
            

    // This is work for the Ticker dropwdown

    // create empty dictonary for ticker info
    var tickerNames = {}

    // for loop to populate the dictionary with stock ticker and name
    for (var i=0;i<data.length;i++) {
        tickerNames[data[i].Ticker]=data[i].name
    };

    console.log(tickerNames)
            
    // creating ticker dropdown
    d3.select("#selDataset2")
            .selectAll("#JordanBelfort")
            .data(Object.entries(tickerNames))
            .enter()
            .append("option")
            .text( function (d) {return `${d[1]} (${d[0]})`})
            .attr("value", function (d) {return d[0]})


    //calling function when a sector is chosen
    d3.selectAll("#selDataset", "#selDataset2").on("change", optionChanged);

    function optionChanged() {
        // selecting the sector dropdown menu
        var dropdownMenu = d3.select("#selDataset");
        // Assign the value of the dropdown menu option to a variable
        var dataset = dropdownMenu.property("value");
        // filter the entire dataset and create an array of stocks in the sector chosen
        var filterArray = data.filter(d1=>d1.sector===dataset);
        
        // creating empty dictionary for filtered stock tickers and names
        var tickerNames2 = {}
    
        // loop to pull those tickers and names
        for (var i=0;i<filterArray.length;i++) {
            tickerNames2[filterArray[i].Ticker]=filterArray[i].name
        };

        // clearing the Ticker dropdown
        d3.select("#selDataset2").html("")
        
        // repopulating the ticker dropdown
        d3.select("#selDataset2")
                .selectAll("#JordanBelfort")
                .data(Object.entries(tickerNames2))
                .enter()
                .append("option")
                .text( function (d) {return `${d[1]} (${d[0]})`})
                .attr("value", function (d) {return d[0]})

    }

})