// Define height and width for svg
var svgHeight = 600;
var svgWidth = document.getElementsByClassName('jumbotron')[0].offsetWidth;

// Define the chart's margins as an object
var chartMargin = {
  top: 40,
  right: 30,
  bottom : 90,
  left:85
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Inital parameters
var chosenXAxis = "poverty";
var chosenYAxis = 'healthcare';

// Function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // Create scales and create different scale for income
    if (chosenXAxis === 'income') {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis])-((d3.min(data, d => d[chosenXAxis])*.0667)), d3.max(data, d => d[chosenXAxis])+((d3.min(data, d => d[chosenXAxis])*.0667))])
        .range([0,chartWidth]);
    } else {
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d[chosenXAxis])-2,d3.max(data, d => d[chosenXAxis])+2])
            .range([0,chartWidth]);
    };
  
    return xLinearScale;
  
  }; // Ends xScale()

// Function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis])-2, d3.max(data, d => d[chosenYAxis])+2])
    // .domain([0, d3.max(data, d => d[chosenYAxis])+2])
    .range([chartHeight, 0]);
    return yLinearScale;
};

// Function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}; // Ends renderAxes

// Function used for updating yAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}; // Ends renderAxes

// Function used for updating points of scatter plot upon click on axis label
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));

    // Return the new circlesGroup
    return circlesGroup;
}; // Ends renderCircles() function

// Function for updating text inside points of scatter plot upon click on axis label
function updateText(circleTexts,newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circleTexts.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis])+3);
    
    // Return the new circlesText
    return circleTexts;
}// Ends updateText() function

// Function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    // Create corresponding labels for x and y variables
    if (chosenXAxis === "poverty") {
      var label = "Poverty : ";
    } else if (chosenXAxis === "age"){
      var label = "Age : ";
    } else if (chosenXAxis === 'income') {
        var label = "Income : ";
    };

    if (chosenYAxis === "healthcare") {
        var yLabel = "Healthcare : ";
    } else if (chosenYAxis === "smokes"){
    var yLabel = "Smokes : ";
    } else if (chosenYAxis === 'obesity') {
        var yLabel = "Obesity : ";
    };

    // Add toolTip
    var toolTip = d3.tip()
      .attr('class','d3-tip')
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
    
    // Show data upon mouseover
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
    // Return the new circlesGroup
    return circlesGroup;
}; // Ends function updateToolTip

// Function for updating scatterplot title upon click on axis label
function updateTitle(chosenXAxis, chosenYAxis) {
        var titleGroup = chartGroup.selectAll('.title')
        titleGroup.text(`${chosenXAxis.replace(/^\w/, c => c.toUpperCase())} vs ${chosenYAxis.replace(/^\w/, c => c.toUpperCase())}`)
        console.log(titleGroup)
};

// Read in the data
d3.csv("data/data.csv").then(function(data) {

    // Convert each category's value to a number
    data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
    });

    // Calculate the correlation coefficient and r2
    statOutput(data,chosenXAxis,chosenYAxis);

    // xLinearScale function inside csv import
    var xLinearScale = xScale(data, chosenXAxis);

    // Call yScale function
    var yLinearScale = yScale(data, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append x axis
    var xAxis = chartGroup.append("g")
                    .classed('x-axis',true)
                    .attr("transform", `translate(0, ${chartHeight})`)
                    .call(bottomAxis);

    // Append y axis
    var yAxis = chartGroup.append("g")
                .classed('y-axis',true)
                .call(leftAxis);

    // Create circlesGroup
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr('r', 9)
        .attr('fill','#008B8B')
        .attr('opacity',0.8)
        .attr('stroke','#008080');

    // Create group for  2 x-axis labels
    var labelsGroupX = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

    // Create group for  2 y-axis labels
    var labelsGroupY = chartGroup.append("g")
        .attr("transform", `translate(${-chartMargin.left/3}, ${chartHeight/2})rotate(-90)`)
    
    // Create group for text inside circles
    var circleTexts = chartGroup.append("text")
        .attr('fill','white')
        .attr('font-size','10px')
        .attr('color','white')
        .attr('text-anchor','middle')
        .selectAll('tspan')
        .data(data)
        .enter()
        .append("tspan")
        .attr('color','white')
        .attr('x', d => xLinearScale(d[chosenXAxis]))
        .attr('y', d => yLinearScale(d[chosenYAxis])+3)
        .text((d) => d.abbr);

    // To update the text properly
    var circleTexts = d3.select('g').selectAll('tspan');

    // Create axis labels:
        // Create poverty label on x-axis
        var povertyLabel = labelsGroupX.append("text")
            .attr('x',0)
            .attr('y',20)
            .attr('value','poverty')
            .classed('active',true)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("fill", "black")
            .attr('font-weight','bold')
            .text("In Poverty (%)");

        // Create age label on x-axis
        var ageLabel = labelsGroupX.append("text")
            .attr('x',0)
            .attr('y',40)
            .attr('value','age')
            .classed('inactive',true)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("fill", "black")
            .attr('font-weight','bold')
            .text("Age (Median)");

        // Create income label on x-axis
        var incomeLabel = labelsGroupX.append("text")
            .attr('x',0)
            .attr('y',60)
            .attr('value','income')
            .classed('inactive',true)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("fill", "black")
            .attr('font-weight','bold')
            .text("Household Income (Median)");

        // Create healthcare label on y-axis
        var healthcareLabel = labelsGroupY.append("text")
            .attr('x',0)
            .attr('y',0)
            .attr('value','healthcare')
            .classed('active',true)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("fill", "black")
            .attr('font-weight','bold')
            .classed("axis-text", true)
            .text("Lacks Healthcare (%)");
        
        // Create smokes label on y-axis
        var smokesLabel = labelsGroupY.append("text")
            .attr('x',0)
            .attr('y',-20)
            .attr('value','smokes')
            .classed('inactive',true)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("fill", "black")
            .attr('font-weight','bold')
            .classed("axis-text", true)
            .text("Smokes (%)");

        // Create obesity label on y-axis
        var obesityLabel = labelsGroupY.append("text")
            .attr('x',0)
            .attr('y',-40)
            .attr('value','obesity')
            .classed('inactive',true)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("fill", "black")
            .attr('font-weight','bold')
            .classed("axis-text", true)
            .text("Obesity (%)");

    // Update tooltip
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    
    // Update title
    var titleLabel = chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${-chartMargin.top/2})`)
        .classed('title',true)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .attr('font-weight','bold')
        .text(`${chosenXAxis.replace(/^\w/, c => c.toUpperCase())} vs ${chosenYAxis.replace(/^\w/, c => c.toUpperCase())}`)

    // Update scatterplot upon click on x-axis label
    labelsGroupX.selectAll('text').on('click', function() {
        var value = d3.select(this).attr('value');

        // Get the current chosenYAxis
        var chosenYAxis = labelsGroupY.selectAll('.active').attr('value');
        var yLinearScale = yScale(data,chosenYAxis);

        if (value !== chosenXAxis) {
            // Replaces chosenXaxis with value
            chosenXAxis = value;

            // Updates x scale for new data
            xLinearScale = xScale(data,chosenXAxis);

            // Updates x axis with transition
            xAxis = renderAxes(xLinearScale, xAxis);

            // Updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        
            // Updates tooltips with new variables
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
            
            // Updates title with new variables
            updateTitle(chosenXAxis, chosenYAxis);

            // Updates text with new variables
            circleTexts = updateText(circleTexts, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // Calculates new statistics with new variables
            statOutput(data, chosenXAxis, chosenYAxis);

            // Make selected axis labels active and others inactive
            if (chosenXAxis === "poverty") {
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            } 
            else if (chosenXAxis === 'age') {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);

            };
        };
    }); // Ends labelsGroupX

    // Update scatterplot upon click on y-axis label
    labelsGroupY.selectAll('text').on('click', function() {
        var value = d3.select(this).attr('value');

        // Get the current selected x-axis label
        var chosenXAxis = labelsGroupX.selectAll('.active').attr('value');
        var xLinearScale = xScale(data,chosenXAxis);

        if (value !== chosenYAxis) {
            // replaces chosenXaxis with value
            chosenYAxis = value;

            // Updates y scale for new data
            yLinearScale = yScale(data,chosenYAxis);

            // Updates y axis with transition
            yAxis = renderAxesY(yLinearScale, yAxis);

            // Updates circles with new variables
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // Updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
            
            // Updates title with new variables
            updateTitle(chosenXAxis, chosenYAxis);

            // Updates text in circles with new variables
            circleTexts = updateText(circleTexts, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // Calculates statistics with new variables
            statOutput(data, chosenXAxis, chosenYAxis)

            // Make selected axis labels active and others inactive
            if (chosenYAxis === "healthcare") {
                healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenYAxis === 'smokes'){
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
            };
        };
    });
    }).catch(function(error) {
        console.log(error);
  });// Ends d3.csv()


// Function to calculate correlation coefficient and r2
function statOutput(data, chosenXAxis, chosenYAxis) {

    d3.select('#stats').selectAll('svg').remove();
    var xVals = data.map(d=>d[chosenXAxis])
    var yVals = data.map(d=>d[chosenYAxis])
    var c = xVals.map(function(e, i) {
        return [e, yVals[i]];
      });
    var correlation = ss.sampleCorrelation(xVals,yVals)
    var linRegress = ss.linearRegression(c)
    var regressionLine = ss.linearRegressionLine(linRegress);
    var rSq = ss.rSquared(c, regressionLine);
    function round(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
      };
    var svgStats = d3.select("#stats")
        .append("svg")
        .attr("height", 120)
        .attr('width','100%')
    var gStats = svgStats.append('g')
    var statRect = gStats.append('rect')
        .attr('width','100%')
        .attr('height',120)
        .attr("rx", 15)	//Round corners 
        .attr("ry", 15)
        .attr('fill','darkslategrey')

    gStats.append('text')
        .attr('x',100)
        .attr('y',40)
        .text(`Correlation Coefficient : ${round(correlation,6)}`)
        .attr('fill','white')
        .attr('text-align','center')

    gStats.append('text')
        .attr('x',100)
        .attr('y',80)
        .text(`rSquared : ${round(rSq,6)}`)
        .attr('fill','white')

};// Ends function statOutput()