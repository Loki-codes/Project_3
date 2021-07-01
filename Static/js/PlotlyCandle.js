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
    document.body.className = "fullscreen";
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
    var high = [sd.Hmo1,sd.Hmo2,sd.Hmo3,sd.Hmo4,sd.Hmo5,sd.Hmo6];
    var low = [sd.Lmo1,sd.Lmo2,sd.Lmo3,sd.Lmo4,sd.Lmo5,sd.Lmo6];
    var open = [sd.Omo1,sd.Omo2,sd.Omo3,sd.Omo4,sd.Omo5,sd.Omo6];
    var volume = [sd.Vmo1,sd.Vmo2,sd.Vmo3,sd.Vmo4,sd.Vmo5,sd.Vmo6];
    var _6MonVolume = [sk[7],sk[12],sk[17],sk[22],sk[27],sk[32]];
    
    
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

    //CANDLESTICK
    var trace1 = {type: "candlestick",x: _6Months,high: high,low: low,open: open,close: close,name:"closing"};

    //CANDLESTICK - OHLC
    var trace2 = {x:_6Months,y:close,width: .5,type: "line",name:"closing"};

    //BAR
    var trace3 = {x:_6MonVolume,y:volume,width: .5,type: "bar"};

    //PREDICTION LINES
    var trace4 = {x:predictAxis,y:predict1,width: .2,type: "line",name:"6-Month prediction"};
    var trace5 = {x:predictAxis,y:predict2,width: .2,type: "line",name:"5-Month prediction"};
    var trace6 = {x:predictAxis,y:predict3,width: .2,type: "line",name:"4-Month prediction"};
    var trace7 = {x:predictAxis,y:predict4,width: .2,type: "line",name:"3-Month prediction"};
    var trace8 = {x:predictAxis,y:predict5,width: .2,type: "line",name:"2-Month prediction"};

    var dataCandle = [trace1, trace2];
    var dataBar = [trace3];
    var dataPredict = [trace4, trace5, trace6, trace7, trace8];

    //CANDLESTICK - OHLC
    var layOut = {title: `${stockData.Ticker} Closing Price`,xaxis: {title: "Month Closing"},yaxis: {title: "Closing Price",autorange: true,type: "linear"}};

    //BAR
    var layOutBar = {title: `${stockData.Ticker} Volume`,xaxis: {title: "Month Closing"},yaxis: {title: "Volume"}};

    //PREDICTION LINES
    var layOutPredict = {title: `${stockData.Ticker} Month by Month prediction`,xaxis: {title: "Month Closing"},yaxis: {title: "Volume"}};

    //json call for the static plots
    d3.json("https://ksheekey.github.io/Greener-Stocks/Static/data/stockInfo.json").then((d) => {
        var ticker = []
        var barPercent = []
    
        for (var i=0;i<d.length;i++) {
            tickInfo = d[i].Ticker;
            var predictData = d[i];
            var pd = predictData;
            var close = [pd.Cmo1,pd.Cmo2,pd.Cmo3,pd.Cmo4,pd.Cmo5,pd.Cmo6];
    
            //prediction1
            var diff = close[0]-close[5];
            var p1p6 = close[0]-(diff*1.2);
            
            //prediction2
            var diff2 = close[1]-close[5];
            var p2p5 = close[1]-(diff2*1.25);
            
            //prediction3
            var diff3 = close[2]-close[5];
            var p3p4 = close[2]-(diff3*1.33);
            
            //prediction4
            var diff4 = close[3]-close[5];
            var p4p3 = close[3]-(diff4*1.5);
            
            //prediction5
            var diff5 = close[4]-close[5];
            var p5p2 = close[4]-(diff5*2);
            
            var avgPredict = [p1p6,p2p5,p3p4,p4p3,p5p2];
            var prediction = d3.mean(avgPredict);
    
            var month7 = close;
            month7.push(prediction);
            var barPoint = month7[6]-month7[5];
            var BP = barPoint / month7[5];
            var bPercent = BP*100;
            barPercent.push(bPercent);
            ticker.push(tickInfo);
        };
        console.log(barPercent)
        //setting up for pie chart
        var values = []
        var labels = []
        
        //filtering data for the pie chart
        var pos20_ = barPercent.filter(d=>d>=20);
        values.push(pos20_.length);labels.push("20% +");
        //
        var pos10_20 = barPercent.filter(d=>d>=10 && d<20);
        values.push(pos10_20.length);labels.push("10% - 20%");
        //
        var pos5_10 = barPercent.filter(d=>d>=5 && d<10);
        values.push(pos5_10.length);labels.push("5% - 10%");
        //
        var pos1_5 = barPercent.filter(d=>d>=1 && d<5);
        values.push(pos1_5.length);labels.push("1% - 5%");
        //
        var pos0_1 = barPercent.filter(d=>d>=0 && d<1);
        values.push(pos0_1.length);labels.push("0% - 1%");
        //
        var neg1_0 = barPercent.filter(d => d>=-1 && d<0);
        values.push(neg1_0.length);labels.push("-1% - 0%");
        //
        var neg5_1 = barPercent.filter(d => d>=-5 && d<-1);
        values.push(neg5_1.length);labels.push("-5% - -1%");
        //
        var neg10_5 = barPercent.filter(d => d>=-10 && d<-5);
        values.push(neg10_5.length);labels.push("-10% - -5%");
        //
        var neg20_10 = barPercent.filter(d => d>=-20 && d<-10);
        values.push(neg20_10.length);labels.push("-20% - -10%");
        //
        var neg20_ = barPercent.filter(d => d<-20);
        values.push(neg20_.length);labels.push("-20% +");
        //
        
        //STATIC LINE
        var trace10 = {x:ticker,y:barPercent,type: "line"};
    
        //STATIC PIE
        var trace11 = {values:values,labels:labels,hole:.4,type:"pie"};
    
        //STATIC LINE
        var data10 = [trace10];

        //STATIC PIE
        var data11 = [trace11];
        
        //STATIC LINE
        var layOut10 = {title: `Predictions by % Change`,yaxis: {title: "6th-7th Month Difference"},shapes: [{type: 'line',x0: stockData.Ticker,y0: 0,x1: stockData.Ticker,yref: 'paper',y1: 1,line: {color: 'red',width: .7,}}]};
    
        //STATIC PIE
        var layOut11 = {title: 'Predicted Percentage Change',showlegend: true,grid: {rows: 1, columns: 1}};

        //plotting the static plots
        Plotly.newPlot("static", data10, layOut10); //static
        Plotly.newPlot("pie", data11, layOut11); //pie
    })

    //plotting the dynamic plots
    Plotly.newPlot("candlestick", dataCandle, layOut); //candlestick
    Plotly.newPlot("bar", dataBar, layOutBar); //bar
    Plotly.newPlot("predictor", dataPredict, layOutPredict); //predictor

    //plotting and resizing the cooresponding image
    if (prediction>close[5]) {
        document.body.className = "removeFS";
        
        document.getElementById('image').src = 'https://ksheekey.github.io/Greener-Stocks/Resources/buybuybuy.gif';
        document.getElementById('image').setAttribute("style", "display");
        document.getElementById('image').style.width='400px';
        document.getElementById('image').style.height='200px';

        document.getElementById('image3').src = 'https://ksheekey.github.io/Greener-Stocks/Resources/arrow.png';
        document.getElementById('image3').setAttribute("style", "display");
        document.getElementById('image3').style.width='400px';
        document.getElementById('image3').style.height='200px';
    }
    else {
        document.body.className = "removeFS";

        document.getElementById('image').src = 'https://ksheekey.github.io/Greener-Stocks/Resources/sellsellsell.gif';
        document.getElementById('image').setAttribute("style", "display");
        document.getElementById('image').style.width='400px';
        document.getElementById('image').style.height='200px';

        document.getElementById('image3').src = 'https://ksheekey.github.io/Greener-Stocks/Resources/arrow.png';
        document.getElementById('image3').setAttribute("style", "display");
        document.getElementById('image3').style.width='400px';
        document.getElementById('image3').style.height='200px';
    }
})
};
init();