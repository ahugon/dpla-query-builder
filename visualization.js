var scale = 10;
var dimensions = Array("collection", "format", "date");
var query = "";


$("#newquery").click(function(event) {

	alert("clicked");
	query = $("#query").val();
	loadQuery(false);

});

function loadNext() {

	var startIndex = query.indexOf("page=");
	var slice = query.substr(startIndex);
	var endIndex = slice.indexOf("&");
	var pageSlice = slice.slice(0, endIndex);
	var prevPageNum = pageSlice.substr(5);
	var nextPage = parseInt(prevPageNum);
	nextPage++;
	query = query.substr(0,startIndex)+"page="+nextPage+slice.substr(endIndex);
	loadQuery(true);

}

function loadQuery(continuation) {

	$("#loading").removeClass("hidden");
	$.getJSON("vizquery.php", {url: query}, function(json) {

		if(!continuation) items = [];

	    $.each(json.docs, function(i, instance) {
			var thing = new item(instance, i);
			items.push(thing);	
		});
		
		console.log(structure);
		structure.children = items;
		structure.size = items.length;

		sortBuckets(dimensions);
	
		root = structure;
		root.x0 = h / 2;
		root.y0 = 0;
		root.children.forEach(toggleAll);

		update(root);		
		$("#loading").addClass("hidden");
		console.log(dimensions);

	});
	
	
}


$(".variable_menu").change(function() {
	var id = $(this).attr('id').substr(3);
	var val = $(this).attr('value');
	var prev;
	switch(id)
	{
	case "1": 
		prev = var1;
		dimensions[0] = val;
		break;
	case "2": 
		prev = var2;
		dimensions[1] = val;
		break;
	case "3": 
		prev = var3;
		dimensions[2] = val;
		break;
	}
	structure.children = items;

	sortBuckets(dimensions);
	structure.children.forEach(toggleAll);
	update(structure);
	
	
});




//$('#var1').val(var1);
//$('#var2').val(var2);
//$('#var3').val(var3);


function item(instance, i) {
	this.name = String(instance.title);
	this.altdisplay = "ALTNER<br>ATE";
	this.format = String(instance.format);

	this.date = instance.temporal[0].start.substring(0,4);
	
	if(instance.isPartOf) this.collection = instance.isPartOf.title;
	else this.collection = null;
	
	if(instance.dplaContributor) this.contributor = instance.dplaContributor.name;
	else this.contributor = null;
	
	if(instance.publisher) this.publisher = instance.publisher;
	else this.publisher = null;
	
	if(instance.dplaContributor) this.contributor = instance.dplaContributor.name;
	
	this.index = i;
	this.type="item";

}

function node(name, children) {
	this.name = name;
	this.altdisplay = "ALTERNATE";
	this.children = children;
	if(children == null) this.children = new Array();
	this.type="node";
	
	
}

function childIndex(children, value) {
	var x = -1;
	$.each(children, function(i, child) {
		if(child.name == value) x = i;
	});
		
	return x;
}



function count(item) {
	var kids = item.children;
	var total = 0;
	if(kids == null) kids = item._children;	
	
	if(kids == null) return 1;
	
	else {
		$.each(kids, function(i, val) {
			total += count(val);
		});	
	}
	
	return total;
}


function toggleAll(d) {
    if (d.children) {
      d.children.forEach(toggleAll);
      toggle(d);
    }
}

var items = [];
var structure = new node("mycollection");


$(function() {
	//query = "http://api.dp.la/v1/items?page_size=75&page=1&temporal.after=1990&";
	//loadQuery(false);

	root = structure;
	root.x0 = h / 2;
	root.y0 = 0;
	root.children.forEach(toggleAll);
	update(root);
});

function sortBuckets(dimensions) {
	var begin = new Date().getTime();

	var roundOne = d3.nest()
	.key(function(d) {return d[dimensions[0]];})
	.sortKeys(d3.ascending)
	.entries(items);
	
	structure.children = roundOne;

	
	$.each(roundOne, function(i, val) {

			
			structure.children[i].name = val.key;
			structure.children[i].type = "node"; 

		if(dimensions[1] != "nada") {
			var roundTwo = d3.nest()
				.key(function(d) {return d[dimensions[1]];})
				.sortKeys(d3.ascending)
				.entries(val.values);	
			structure.children[i].children = roundTwo;	
			
		$.each(structure.children[i].children, function(j, val2) {
			structure.children[i].children[j].name = val2.key;
			structure.children[i].children[j].type = "node";

			if(dimensions[2] != "nada") {
			var roundThree = d3.nest()
				.key(function(d) {return d[dimensions[2]];})
				.sortKeys(d3.ascending)
				.entries(val2.values);	
				
			structure.children[i].children[j].children = roundThree;	
			
			$.each(structure.children[i].children[j].children, function(k, val3) {
				structure.children[i].children[j].children[k].name = val3.key;
				structure.children[i].children[j].children[k].children = val3.values;	
				structure.children[i].children[j].children[k].type = "node";			
			});		
			
			
			} else structure.children[i].children[j].children = val.values;

		});	
		
		} else structure.children[i].children = val.values;
	});
	
			console.log(structure);

	console.debug( new Date().getTime() - begin );

}


///////////////

var m = [20, 120, 20, 120],
    w = 1280 - m[1] - m[3],
    h = 800 - m[0] - m[2],
    i = 0,
    root;

var tree = d3.layout.tree()
    .size([h, w]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var vis = d3.select("#body").append("svg:svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
  .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");






function update(source) {
	$("#query-info").html("");
	$("#query-info").append(structure.size + " items. ");
	$("#query-info").append("<a href='#' id='loadnext' onclick='loadNext();return false;'>Load next page.</a>");

  var duration = d3.event && d3.event.altKey ? 5000 : 500;

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse();
  console.log(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = vis.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", function(d) {highlightNode(this, d);})
      .on("dblclick", function(d) { 
      		if(d.type == "item") expandItemInfo(this, d);
      		else toggle(d); 
      		update(d);
      	});




  nodeEnter.append("svg:circle")
      .attr("r", function(d) {
      		var multiplier = 1;
      		
      		if(d._children != null) {
      			d.size = count(d);
      			multiplier += (d.size / scale);
      		} if(d.isTop != null) {
      			multiplier += (d.size / scale);
      		}
      		var newR = 4.5 * multiplier;
      		if(newR > 40) newR = 40;
      		return newR;})
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });


//add size to nodes
	nodeEnter.append("svg:text")
		.text(function(d) {
			if(d.type == "item") return "";
			else return d.size;
		})
		.attr("x", function(d){
			var r = 4.5*(1 + d.size / scale) / 2;
			return r+8;
		})
		.attr("y", function(d) {
			var r = 4.5*(1 + d.size / scale);
			return r;		
		})
		.style("fill", "lightsteelblue")
		.style("fill-opacity", 1);

  nodeEnter.append("svg:text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("class", function(d) {
      		return d.type;
     	 })
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
     // .attr("r", function(d) {console.log(d._children); return 4.5;})
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = vis.selectAll("path.link")
      .data(tree.links(nodes), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("svg:path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
    .transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children.
function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
    console.log(d);
  }
}

var highlightColor = "rgb(255, 0, 0)";
var highlightColorChrome = "#ff0000";



function highlightNode(node, d) {
	var circle = $(node).find("circle");
	if($(circle).css("fill") != highlightColor && $(circle).css("fill") != highlightColorChrome) {
		$(circle).css("fill", highlightColor);
	} else if(d.children == null) {
		$(circle).css("fill", "lightsteelblue");
	} else $(circle).css("fill", "#fff");
}

function expandItemInfo(node, d) {
	var text = $(node).find("text");
	var alttext = $(text).text();
//	$(text).text("<tspan>hello</tspan>");
	d.altdisplay = alttext;

}

function orderBucket(node) {
	if (node.isNumeric) {
		console.log("NUM");
		node.children.sort(function(a, b) { return parseInt(b.name) - parseInt(a.name);});
	} else {
		node.children.sort(function(a, b) {return String(a.name).toUpperCase() > String(b.name).toUpperCase(); });
	}
	
}

