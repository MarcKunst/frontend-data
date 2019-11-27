const endpoint = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-18/sparql";
const queryWeaponsAll = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX edm: <http://www.europeana.eu/schemas/edm/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX ns: <http://example.com/namespace>
SELECT (SAMPLE(?cho) AS ?choSample) ?type ?placeLabel WHERE {      <https://hdl.handle.net/20.500.11840/termmaster7104> skos:narrower* ?place .
  
  VALUES ?type { "zwaard" "Zwaard" "boog" "Boog" "lans" "Lans" "mes" "Mes" "knots" "Knots" "Piek" "Piek" "vechtketting" "Vechtketting" "dolk" "Dolk" "bijl" "Bijl" "strijdzeis" "Strijdzeis" "Sabel" "sabel" }.
  
     ?place skos:prefLabel ?placeLabel .      ?cho edm:isRelatedTo <https://hdl.handle.net/20.500.11840/termmaster2815>; # selecteer handwapens
                                                                                                               
     dc:type ?type ;
     dct:spatial ?place .
} ORDER BY ?cho
`

runQuery(endpoint, queryWeaponsAll)
    .then(data => handleData(data)
    );

    function handleData(data) {
        const cleanedData = loopData(data);
        const nestedData = nestObjects(cleanedData);
        const PieChartArrays = nestObjectsPieChart(cleanedData);
        const filter = filterEmptyValues(PieChartArrays);
        console.log(filter)
        d3Circles(nestedData, PieChartArrays, filter);
        createPieChart(filter, 0);
        
    }  

    function loopData(data) {
        return data.map(dataItem => theNestProperties(dataItem));
    }

    function theNestProperties(data) {
        return Object.assign({}, data, {
            choSample: data.choSample.value,
            type: data.type.value.toLowerCase(),
            placeLabel: data.placeLabel.value.toLowerCase()
        });
    }
    // bovenstaande functie is in samenwerking met mijn klasgenoot Chazz

    function nestObjects(cleanedData) {
        const expensesByType = d3.nest()
            .key(d => d.type)
            .rollup(v => v.length)
            .entries(cleanedData);
            return expensesByType;
    }

    function nestObjectsPieChart(cleanedData) {
        const typeAmountPerRegion = d3.nest()
            .key(d => d.type)
            .rollup(d => {
                return {
                    amount: d.length,
                    countries:[
                        {
                            placeLabel: "japan",
                            countObj: d3.sum(d.map(c => c.placeLabel == "japan"? 1: 0)),
                        },
                        {
                            placeLabel: "china",
                            countObj: d3.sum(d.map(c => c.placeLabel == "china"? 1: 0)),
                        },
                        {
                            placeLabel: "tibet",
                            countObj: d3.sum(d.map(c => c.placeLabel == "tibet"? 1: 0)),
                        },
                        {
                            placeLabel: "shimonoseki",
                            countObj: d3.sum(d.map(c => c.placeLabel == "shimonoseki"? 1: 0)),
                        },
                        {
                            placeLabel: "xiamen",
                            countObj: d3.sum(d.map(c => c.placeLabel == "xiamen"? 1: 0)),
                        },
                    ]
                };
            })
            .entries(cleanedData);
            return typeAmountPerRegion;
    }

function filterEmptyValues(data) {

    const newData = data.map(item => 
        item.value.countries.filter(country => country.countObj !== 0)
    );
    return newData;
}

function runQuery(url, query) {
    return fetch(url + "?query=" + encodeURIComponent(query) + "&format=json")
        .then(res => res.json())
        .then(data => data.results.bindings)
        .catch(error => {
            console.log(error);
        });
}

//D3 bubblechart

function d3Circles(nestedData, data, filter){
    const dataset = {
        children: nestedData
    };
//The code below (related to the bubblechart) is written by Alok K. Shukla and adjusted by me to fit my project
// link to code: https://bl.ocks.org/alokkshukla/3d6be4be0ef9f6977ec6718b2916d168

    const bubbleChartWidth = 400;
    const bubbleChartHeight = 400;

        let bubble = d3.pack(dataset)
            .size([bubbleChartWidth, bubbleChartHeight])
            .padding(1.5);
        
            let tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return d.data.key + ", aantal: " + d.value;
            });

        let svg = d3.select("#bubbleChart")
            .append("svg")
            .attr("class", "bubble")

        svg.transition()
            .delay(1100)
            .duration(1000)
            .ease(d3.easeBounce);
            
            svg.call(tip);

        let nodes = d3.hierarchy(dataset)
            .sum(function(d) { return d.value; });
        

        let node = svg.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children;
            })
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"
            });
            

        d3.selectAll(".node")
        .on("click", function(d, i) {
            const currentBubble = i;
            createPieChart(filter, currentBubble);
        });

        node.append("title")
            .text(function(d) {
                return d.data.key + ": " + d.value;
            });
            
        let circle = node.append("circle")
            .attr("r", function(d) {
            return d.r/1000;
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
        
        circle.transition()
            .delay(100)
            .duration(900)
            .attr("r", function(d) {
                return d.r;
            })
            .ease(d3.easeCircleOut);
        
        let text = node.append("text")
            .attr("dy", ".2em")
            .text(function(d) {
                return  d.data.key.substring(0, d.r / 3);
            })
            .attr("font-size", function(d){
                return d.r/1000;
            });

            text.transition()
            .delay(450)
            .duration(900)
            .attr("font-size", function(d) {
                return d.r/3;
            })
            .ease(d3.easeCubicOut);

        d3.select(self.frameElement)
            .style("height", bubbleChartHeight + "px");
}

// Pie chart
//The code below (related to the Pie chart) is written by Karthik Thota and adjusted by me to fit my project
// link to video: https://www.youtube.com/watch?time_continue=113&v=kK5kKA-0PUQ&feature=emb_logo

const margin = {top: 20, right: 20, bottom: 20, left: 20},
        pieWidth = 350 - margin.right - margin.left,
        pieHeight = 350 - margin.top - margin.bottom,
        pieRadius = pieWidth/2;

//color
const color = d3.scaleOrdinal()
    .range(["#f1c40f", "#2ecc71", "#9b59b6", "#e74c3c", "#3498db"]);

//arc generator
const arc = d3.arc()
    .outerRadius(pieRadius - 10)
    .innerRadius(0);

const arcLabel = d3.arc()
    .outerRadius(pieRadius - 50)
    .innerRadius(pieRadius - 50);

//pie generator
const pie = d3.pie()
    .sort(null)
    .value(function(d) {
        return d.countObj;
    });

const svg = d3.select("#pieChart").append("svg")
    .attr("width", pieWidth)
    .attr("height", pieHeight)
    .append("g")
    .attr("transform", "translate(" + pieWidth/2 + "," + pieHeight/2 + ")");

//create pie chart
function createPieChart(data, n) {
    console.log(data[n])    
    let g = svg.selectAll(".arc")
        .data(pie(data[n]))

        let tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([5, 0])
        .html(function(d) {
          return d.data.placeLabel + ", aantal:" + d.data.countObj;
        });

        svg.call(tip);

    let gEnter = g.enter().append("g")
        .attr("class", "arc")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    gEnter.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color(d.data.placeLabel);
        })
        .transition()
        .ease(d3.easeCircle)
        .duration(1000)
        .attrTween("d", function(b){
            b.innerRadius = 0; // animation starts at 0
            let i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
            return function(t) { return arc(i(t));};
        })
        

    gEnter.append("text")
        .transition()
        .ease(d3.easeLinear)
        .duration(1000)
        .attr("transform", function(d) { return "translate(" + arcLabel.centroid(d) + ")";})
        .attr("dy", ".35em")
        .attr("class", "pieText")
        .text( function(d) { return d.data.countObj;})

    updatePieChart(g);
}

function updatePieChart(g) {

        g.select("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color(d.data.placeLabel);
        })
        .transition()
        .ease(d3.easeLinear)
        .duration(1000)
        .attrTween("d", function(b){
            b.innerRadius = 0; // animation starts at 0
            let i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
            return function(t) { return arc(i(t));};
        });

        g.select("text")
        .transition()
        .ease(d3.easeLinear)
        .duration(1000)
        .attr("transform", function(d) { return "translate(" + arcLabel.centroid(d) + ")";})
        .text( function(d) { return d.data.countObj })
    
        g.exit().remove()
    } 


// Bubble legend
//The code below (related to the bubble chart legend) is written by Justin Palmer and adjusted by me to fit my project
// link to code: http://bl.ocks.org/caged/6476579

var height = 220
var width = 360
var svgLegend = d3.select("#bubbleLegend")
  .append("svg")
    .attr("width", width)
    .attr("height", height)

// The scale you use for bubble size
var size = d3.scaleSqrt()
  .domain([1, 60])  // What's in the data, let's say it is percentage
  .range([1, 150])  // Size in pixel

// Add legend: circles
var valuesToShow = [15, 30, 60]
var xCircle = 140
var xLabel = 300
var yCircle = 210
svgLegend
  .selectAll("legend")
  .data(valuesToShow)
  .enter()
  .append("circle")
    .attr("cx", xCircle)
    .attr("cy", function(d){ return yCircle - size(d/2);} )
    .attr("r", function(d){ return size(d/2);})
    .attr("stroke", "black");

// Add legend: segments
svgLegend
  .selectAll("legend")
  .data(valuesToShow)
  .enter()
  .append("line")
    .attr('x1', function(d){ return xCircle + size(d/2);} )
    .attr('x2', xLabel-35)
    .attr('y1', function(d){ return yCircle - size(d/2);} )
    .attr('y2', function(d){ return yCircle - size(d/2);} )
    .attr('stroke', 'white')
    .style('stroke-dasharray', ('5'));

// Add legend: labels
svgLegend
  .selectAll("legend")
  .data(valuesToShow)
  .enter()
  .append("text")
    .attr('x', xLabel)
    .attr('y', function(d){ return yCircle - size(d/2);} )
    .attr("class", "bubbleLegendText")
    .text( function(d){ return d + " objecten" } )
    .attr('alignment-baseline', 'middel');