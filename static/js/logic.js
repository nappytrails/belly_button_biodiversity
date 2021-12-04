const path = "static/data/samples.json";

// Promise Pending
// const dataPromise = d3.json(path);
// console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(path).then(function(data) {
    console.log(data);

    // Dropdown menu
    var dropdown = d3.select("#selDataset");
    var dropdownData = data["names"];
    dropdownData.forEach((element) => {
    dropdown.append("option").property("value", element).text(element);
    });
  
    let firstSample = data["names"][0];

    
    demographicsCreate(firstSample);
    plotsCreate(firstSample)
 
  
});


function dropdownChange(option){
  console.log(option);
  demographicsCreate(option);
  plotsCreate(option);

}

function demographicsCreate(option){

    d3.json(path).then(function(data) {
    
    let metadata = data["metadata"].filter(sample => sample["id"] == option);

    // Demographics table
    let demographics = metadata[0];

    console.log(demographics);

    var tableData = [{
      type: 'table',
      header: {
        values: Object.keys(demographics),
        align: "center",
        line: {width: 1, color: 'SlateGrey'},
        fill: {color: "SlateGrey"},
        font: {family: "Arial", size: 12, color: "white"}
      },
      cells: {
        values: Object.values(demographics),
        align: "center",
        line: {color: "SlateGrey", width: 1},
        font: {family: "Arial", size: 11, color: ["black"]}
      }
    }]

    Plotly.newPlot('demographics', tableData);
  });
}

function plotsCreate(option){

  d3.json(path).then(function(data) {
    
    let sampleSet = data["samples"].filter(sample => sample["id"] == option);

    console.log(sampleSet);

    let sampleValues = sampleSet[0]["sample_values"];
    let otuIDS = sampleSet[0]["otu_ids"];
    let otuLabels = sampleSet[0]["otu_labels"];
    
    // Horizontal bar chart
    let title = "Top 10 OTUs Per Respondant"

    let trace1 = {
        x: sampleValues.slice(0,10).reverse(),
        y: otuIDS.slice(0,10).map(id => `OTU ${id}`).reverse(),
        type: 'bar',
        orientation: 'h',
        text: otuLabels
      };
      
      let barPlot = [trace1];
      
      let layout = {
        title: title
      };
      
      Plotly.newPlot("plot", barPlot, layout);


    // Bubble plot
    let bubbleTitle = "Full Fauna Profile"
    var bubbleTrace = {
      x: otuIDS,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIDS
      }
    };
      
    var bubbleData = [bubbleTrace];
      
    var bubbleLayout = {
      title: bubbleTitle,
      showlegend: false,
      // height: 600,
      // width: 600
      };
      
    Plotly.newPlot('bubble_plot', bubbleData, bubbleLayout);

  })
}
