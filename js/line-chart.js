
//API to fetch historical data of Bitcoin Price Index
const api = 'https://api.coindesk.com/v1/bpi/historical/close.json?start=2017-12-31&end=2018-04-01';

/**
 * Loading data from API when DOM Content has been loaded'.
 */
document.addEventListener("DOMContentLoaded", event => {
fetch(api)
    .then(response => { return response.json(); })
    .then(data => {
        let parsedData = parseData(data);
        drawChart(parsedData);
    })
    .catch(err => { console.log(err); })
});

/**
 * Parse data into key-value pairs
 * @param {object} data Object containing historical data of BPI
 */
function parseData (data) {
    let arr = [];
    for (let i in data.bpi) {
        arr.push({
            date: new Date(i), //date
            value: +data.bpi[i] //convert string to number
        });
    }
    return arr;
}

/**
 * Creates a chart using D3
 * @param {object} data Object containing historical data of BPI
 */
function drawChart(data) {
    let lineSVGWidth = 600, lineSVGHeight = 400;
    let margin = { top: 20, right: 20, bottom: 30, left: 50 };
    let width = lineSVGWidth - margin.left - margin.right;
    let height = lineSVGHeight - margin.top - margin.bottom;

    let lineSVG = d3.select('.line-chart')
        .attr("width", lineSVGWidth)
        .attr("height", lineSVGHeight);
        
    let g = lineSVG.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let x = d3.scaleTime()
        .rangeRound([0, width]);

    let y = d3.scaleLinear()
        .rangeRound([height, 0]);

    let line = d3.line()
        .x(d => { return x(d.date)})
        .y(d => { return y(d.value)})
        x.domain(d3.extent(data, d => { return d.date }));
        y.domain(d3.extent(data, d => { return d.value }));

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($)");

    g.append("path")
        .datum(data)
        .attr("class", "data-line")
        .attr("fill", "none")
        .attr("stroke", "darkblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", line);
}

