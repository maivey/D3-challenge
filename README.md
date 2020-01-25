# Data Journalism and D3
Analyzes the current trends shaping people's lives, as well as creates charts, graphs, and interactive elements to help readers understand my findings.

![Newsroom](https://media.giphy.com/media/v2xIous7mnEYg/giphy.gif)

View the deployed project [here](https://maivey.github.io/D3-challenge/D3_data_journalism/index.html)

This script is for the following scenario:
Welcome to the newsroom! You've just accepted a data visualization position for a major metro paper. You're tasked with analyzing the current trends shaping people's lives, as well as creating charts, graphs, and interactive elements to help readers understand your findings.

The editor wants to run a series of feature stories about the health risks facing particular demographics. She's counting on you to sniff out the first story idea by sifting through information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System.

The data set is based on 2014 ACS 1-year estimates: [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml). The current data set incldes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."


### Setup
Include this in the `<head>` of the `index.html` file:

* Bootstrap : `<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">`
* CSS : `<link rel="stylesheet" href="assets/css/style.css">`
* CSS for D3 : `<link rel="stylesheet" href="assets/css/d3Style.css">`

Include this in the `<body>` of the `index.html` file:
```
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>

<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
```
D3: `<script src="https://d3js.org/d3.v5.min.js"></script>`
`<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.7.1/d3-tip.min.js"></script>`

app.js : `<script type="text/javascript" src="app.js"></script>`
Statistics PlugIn : `<script src = "https://unpkg.com/simple-statistics@7.0.2/dist/simple-statistics.min.js"></script>`




### Step 1: D3 Dabbler

Creates a scatter plot between two of the data variables such as `Healthcare vs. Poverty` or `Smokers vs. Age`.

Using the D3 techniques, creates a scatter plot that represents each state with circle elements. The code for this graphic is in the `app.js` file and pulls in the data from `data.csv` by using the `d3.csv` function.

* Includes state abbreviations in the circles.

* Creates and situates the axes and labels to the left and bottom of the chart.

* Note: You'll need to use `python -m http.server` to run the visualization. This will host the page at `localhost:8000` in your web browser.

- - -

### Step 2:

#### 1. More Data, More Dynamics

Includes more demographics and more risk factors. Places additional labels in the scatter plot and gives them click events so that the users can decide which data to display. Animates the transitions for the circles' locations as well as the range of the axes. Creates three for each axis.

#### 2. Incorporate d3-tip

While the ticks on the axes allow us to infer approximate values for each circle, it's impossible to determine the true value without adding another layer of data. Enter tooltips: developers can implement these in their D3 graphics to reveal a specific element's data when the user hovers their cursor over the element. Adds tooltips to the circles and displays each tooltip with the data that the user has selected. 






