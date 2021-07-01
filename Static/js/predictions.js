// setting the dropdown
d3.json("https://ksheekey.github.io/Greener-Stocks/Static/data/stockInfo.json").then((d) => {
    var tickerNames = {}
    
    for (var i=0;i<d.length;i++) {
        tickerNames[d[i].Ticker]=d[i].name
    };
    
    d3.select("#selDataset")
            .selectAll("#JordanBelfort")
            .data(Object.entries(tickerNames))
            .enter()
            .append("option")
            .text( function (d) {return `${d[1]} (${d[0]})`})
            .attr("value", function (d) {return d[0]})
});
 
//setting the stock image on page load
function init() {
    d3.select("h5").html("")
}

//calling function when a stock is chosen
d3.selectAll("#selDataset").on("change", optionChanged);



//defining function for change, json call, for plots
function optionChanged(sample) {
    
d3.json("https://ksheekey.github.io/Greener-Stocks/Static/data/stockInfo.json").then((d) => {
    var filterArray = d.filter(sampleObject=>sampleObject.Ticker==sample);
    var stockData = filterArray[0];
    console.log(filterArray)

    var stockKeys = Object.keys(stockData);
    var sk = stockKeys;
    var sd = stockData;
    var _6Months = [sk[6],sk[11],sk[16],sk[21],sk[26],sk[31]];
    var close = [sd.Cmo1,sd.Cmo2,sd.Cmo3,sd.Cmo4,sd.Cmo5,sd.Cmo6];
    
    //predict
    var predictAxis = _6Months;
    predictAxis.push("7moC");

    //prediction1
    var diff = close[0]-close[5];
    var p1p0 = close[0];
    var p1p1 = close[0]-(diff*.20);
    var p1p2 = close[0]-(diff*.40);
    var p1p3 = close[0]-(diff*.60);
    var p1p4 = close[0]-(diff*.8);
    var p1p5 = close[5];
    var p1p6 = close[0]-(diff*1.2);
    var predict1 = [p1p0,p1p1,p1p2,p1p3,p1p4,p1p5,p1p6];

    //prediction2
    var diff2 = close[1]-close[5];
    var p2p0 = close[1];
    var p2p1 = close[1]-(diff2*.25);
    var p2p2 = close[1]-(diff2*.50);
    var p2p3 = close[1]-(diff2*.75);
    var p2p4 = close[5];
    var p2p5 = close[1]-(diff2*1.25);
    var predict2 = [p2p0,p2p0,p2p1,p2p2,p2p3,p2p4,p2p5];

    //prediction3
    var diff3 = close[2]-close[5];
    var p3p0 = close[2];
    var p3p1 = close[2]-(diff3*.3333);
    var p3p2 = close[2]-(diff3*.6666);
    var p3p3 = close[5];
    var p3p4 = close[2]-(diff3*1.33);
    var predict3 = [p3p0,p3p0,p3p0,p3p1,p3p2,p3p3,p3p4];

    //prediction4
    var diff4 = close[3]-close[5];
    var p4p0 = close[3];
    var p4p1 = close[3]-(diff4*.5);
    var p4p2 = close[5];
    var p4p3 = close[3]-(diff4*1.5);
    var predict4 = [p4p0,p4p0,p4p0,p4p0,p4p1,p4p2,p4p3];

    //prediction5
    var diff5 = close[4]-close[5];
    var p5p0 = close[4];
    var p5p1 = close[5];
    var p5p2 = close[4]-(diff5*2);
    var predict5 = [p5p0,p5p0,p5p0,p5p0,p5p0,p5p1,p5p2];
    var avgPredict = [p1p6,p2p5,p3p4,p4p3,p5p2];
    var prediction = d3.mean(avgPredict);
    var month7 = close;
    month7.push(prediction);

    //PREDICTION LINES
    var trace4 = {x:predictAxis,y:predict1,width: .2,type: "line",name:"6-Month prediction"};
    var trace5 = {x:predictAxis,y:predict2,width: .2,type: "line",name:"5-Month prediction"};
    var trace6 = {x:predictAxis,y:predict3,width: .2,type: "line",name:"4-Month prediction"};
    var trace7 = {x:predictAxis,y:predict4,width: .2,type: "line",name:"3-Month prediction"};
    var trace8 = {x:predictAxis,y:predict5,width: .2,type: "line",name:"2-Month prediction"};

    
    var dataPredict = [trace4, trace5, trace6, trace7, trace8];
    

    //PREDICTION LINES
    var layOutPredict = {title: `${stockData.Ticker} Month by Month prediction`,xaxis: {title: "Month Closing"},yaxis: {title: "Volume"},height: 500,width: 1110};

    //plotting the dynamic plots
    Plotly.newPlot("predictor", dataPredict, layOutPredict);

    d3.select("#reset").html("")

    var pointChange = prediction-month7[5]
    var pChange = pointChange/month7[5]
    var prcntChange = pChange*100
    d3.select("#reset")
    .append("h5")
    .text(`Our predicted 7th Month Closing Price is ${parseFloat(prediction.toFixed(4))} which is a ${parseFloat(pointChange.toFixed(4))} point difference from the 6th Month (%${parseFloat(prcntChange.toFixed(2))})`)

    
    
    
})


};



init();