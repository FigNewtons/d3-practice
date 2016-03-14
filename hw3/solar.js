var margin = { top: 10, right: 30, bottom: 30, left: 30 },
    width = 1440,
    height = 500;

var radius = d3.scale.linear(),
    distance = d3.scale.linear();


d3.json("solarsystem.json", function(error, data){

    if (error) throw error;

    var solarsystem = data.solarsystem;
    var radii = solarsystem.map(function(d){ return d["radius"] });
    var dist = solarsystem.map(function(d){return d["distance"] });

    // Should map from [0, 700 000] -> [0, 150]
    radius.domain([0, d3.max(radii)]).nice()
          .range([0, 150]);

    // Should map from [0, 6000] -> [0, 1200] 
    distance.domain([0, d3.max(dist)]).nice()
            .range([0, 1200]);

    var tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("visibility", "hidden");

    var svg = d3.select("body").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                    .attr("transform", translate(margin.left, margin.top));

    var circles = svg.selectAll("circle")
                    .data(solarsystem)
                    .enter()
                    .append("circle")
                    .attr("cx", offset)
                    .attr("cy", 250)
                    .attr("r", function(d){ return radius(d["radius"]); })
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout) 
                    .on("click", click);

    var text = svg.selectAll("text")
                  .data(solarsystem)
                  .enter()
                  .append("text")
                  .attr("x", offset)
                  .attr("y", function(d, i){ return 50 + 10 * i; })
                  .attr("text-anchor", "middle")
                  .attr("fill", "red")
                  .text(function(d){ return d["name"]; });


    function translate(x, y){
        return "translate(" + x + "," + y + ")";
    }

    function offset(d){
        var fromSun = distance(d["distance"]);
        return fromSun > 0 ? radius(d3.max(radii)) + fromSun : fromSun;
    }

    function click(){
        var circle = d3.select(this);
        circle.transition()
              .duration(1000)
              .attr("cy", 300)
              .transition()
              .duration(1000)
              .attr("cy", 250);
    };

    function mouseover(d){
        d3.select(this)
          .attr("r", enlarge(d))   
          .style("fill", "red");

        tooltip.transition()
               .duration(500)
               .style("top", (d3.event.pageY - 25) + "px")
               .style("left", d3.event.pageX + "px")
               .style("visibility", "visible")
               .text(d["name"] + "'s distance from sun: " + 
                     d["distance"] + " million miles");
    };

    function mouseout(d){
        d3.select(this)
          .attr("r", radius(d["radius"]))
          .style("fill", "white");

        tooltip.transition()
               .duration(500)
               .style("visibility", "hidden");
    };

    function enlarge(d){
        var r = radius(d["radius"]);
        return r > 2 ? r * 1.2 : r * 10;
    };

});
