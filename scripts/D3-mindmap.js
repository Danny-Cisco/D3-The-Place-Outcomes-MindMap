
  
function createChart() {

  // At the start of your chart function, select the slider and listen for change events
const slider = d3.select("#spacing-slider");

slider.on("input", function(event) {
  spacingFactor = +event.target.value; // Convert to number
  updateSpacing();
});


  const width = 1200;
  const marginTop = 200;
  const marginRight = 100;
  const marginBottom = 200;
  const marginLeft = 200;

  const root = d3.hierarchy(data);
  const dx = 25;

  let spacingFactor = 1.7; // Adjust as needed
  const dy = spacingFactor * (width - marginRight - marginLeft) / (1 + root.height);


  const tree = d3.tree().nodeSize([dx, dy]);
  const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", dx)
    .attr("viewBox", [-marginLeft, -marginTop, width, dx])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif; user-select: none;")
    .call(d3.zoom().scaleExtent([0.5, 5]).on("zoom", zoomed));

  const gLink = svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "#ccccee")
    .attr("stroke-opacity", 0.5)
    .attr("stroke-width", 2.5);

  const gNode = svg.append("g")
    .attr("cursor", "pointer")
    .attr("pointer-events", "all");

  function zoomed(event) {
    gNode.attr("transform", event.transform);
    gLink.attr("transform", event.transform);
  }



  function update(event, source) {
    const duration = event?.altKey ? 1200 : 400; // hold the alt key to slow down the transition
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + marginTop + marginBottom;

    const transition = svg.transition()
        .duration(duration)
        .ease(d3.easeCubicInOut)
        .attr("height", height)
        .attr("viewBox", [-marginLeft, left.x - marginTop, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes…
    const node = gNode.selectAll("g")
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(event, d);
        });

    nodeEnter.append("circle")
        .attr("r", d => getNodeRadius(d))
        .attr("stroke-width", 15)
        .attr("fill", d => getNodeFillColor(d));

            


const textTransitionDuration = 800;

nodeEnter.append("text")
    .attr("dy", ".31em")
    .attr("x", 8) 
    .attr("text-anchor", "start")
    .text(d => d.data.name)
    .on("mouseover", function(event, d) {
        d3.select(this)
          .transition("textMouseTransition") // naming the transition
          .duration(textTransitionDuration)
          .ease(d3.easeElastic)
          .style("font-size", "14px");
    })
    .on("mouseout", function(event, d) {
        d3.select(this)
          .transition("textMouseTransition") // naming the transition
          .duration(900)
          .ease(d3.easeElastic)
          .style("font-size", "10px");
    })
    .clone(true).lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 4)
        .attr("stroke", "white");






    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);
        
    nodeUpdate.select("circle")
        .attr("r", d => getNodeRadius(d))
        .attr("fill", d => getNodeFillColor(d));



    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path")
      .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Do the first update to the initial configuration of the tree — where a number of nodes
  // are open (arbitrarily selected as the root, plus nodes with 7 letters).

  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth && d.data.name.length !== 7) d.children = null;
  });
  
function getNodeRadius(d) {
    if (d._children && !d.children) {  // If node is collapsed but contains children
        return 8;
    } else {
        return 4;
    }
}

  function getNodeFillColor(d) {
    if (d._children && !d.children) {  // If node is collapsed but contains children
        return "#ffaaaa";  // Light red for larger nodes
    } else {
        return "#aaaaff";  // Light blue for smaller nodes
    }
}


function updateSpacing() {
  const newDy = spacingFactor * (width - marginRight - marginLeft) / (1 + root.height);
  tree.nodeSize([dx, newDy]);
  update(null, root);
}

  
  update(null, root);

svg.on("wheel", function(event) {
  if (event.shiftKey) {
    if (event.wheelDelta) { 
      if (event.wheelDelta > 0 && spacingFactor < 10) { // Add upper limit check
        spacingFactor += 0.15;
      } else if (event.wheelDelta <= 0 && spacingFactor > 0.6) { // Add lower limit check
        spacingFactor -= 0.15;
      }
    } else if (event.deltaY) {
      if (event.deltaY > 0 && spacingFactor > 0.6) { // Add lower limit check
        spacingFactor -= 0.15; 
      } else if (event.deltaY <= 0 && spacingFactor < 10) { // Add upper limit check
        spacingFactor += 0.15;
      }
    }

    updateSpacing();
  }
});




  
  return svg.node();
}