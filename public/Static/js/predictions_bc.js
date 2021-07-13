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
        console.log(ticker)
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
        var layOut10 = {title: `Predictions by % Change`,yaxis: {title: "6th-7th Month Difference"},height: 500,width: 1110};
    
        //STATIC PIE
        var layOut11 = {title: 'Predicted Percentage Change',height: 500,width: 1110,showlegend: true,grid: {rows: 1, columns: 1}};
    
        //plotting the static plots
        Plotly.newPlot("static", data10, layOut10);
        Plotly.newPlot("pie", data11, layOut11);
})}

//calling function when a stock is chosen
d3.selectAll("#selDataset").on("change", optionChanged);

//defining function for change, json call, for plots
function optionChanged(sample) {
d3.json("https://ksheekey.github.io/Greener-Stocks/Static/data/stockInfo.json").then((d) => {
    var filterArray = d.filter(sampleObject=>sampleObject.Ticker==sample);
    var stockData = filterArray[0];
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
    console.log(ticker)
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
    var layOut11 = {title: 'Predicted Percentage Change',height: 600,width: 1110,showlegend: true,grid: {rows: 1, columns: 1}};

    //plotting the static plots
    Plotly.newPlot("static", data10, layOut10);
    Plotly.newPlot("pie", data11, layOut11);
})
}
init()