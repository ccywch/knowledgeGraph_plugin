// ==UserScript==
// @name        knowledgeGraph
// @namespace   ccy
// @require     http://d3js.org/d3.v3.min.js
// @require     https://code.jquery.com/jquery-2.1.4.min.js
// @include     https://www.google.com*
// @version     1
// @grant       none
// ==/UserScript==

//The alternative ones is to use jquery waitForKeyElements https://gist.github.com/raw/2625891/waitForKeyElements.js
//The code is modified from one answer in http://stackoverflow.com/questions/18989345/how-do-i-reload-a-greasemonkey-script-when-ajax-changes-the-url-without-reloadin
var fireOnHashChangesToo    = true;
var pageURLCheckTimer       = setInterval (
    function () {
        if (   this.lastPathStr  !== location.pathname
            || this.lastQueryStr !== location.search
            || (fireOnHashChangesToo && this.lastHashStr !== location.hash)
        ) {
            this.lastPathStr  = location.pathname;
            this.lastQueryStr = location.search;
            this.lastHashStr  = location.hash;
            gmMain ();
        }
    }
    , 111
);

function gmMain () {
    console.log ('A "New" page has loaded.');           //for debugging
    // DO WHATEVER YOU WANT HERE.
    var checkWiki = document.getElementById("wiki") ;
    var checkGraph = document.getElementById("graph");
    var checkButton = document.getElementById("button");
    
    if  ( checkWiki != null || checkGraph != null || checkButton != null)    //delete thr dom if exists
    {
      checkWiki.parentNode.removeChild(checkWiki);
      checkGraph.parentNode.removeChild(checkGraph);
      checkButton.parentNode.removeChild(checkButton);
    }
  
    var tag = document.getElementById("lst-ib").value.toLowerCase().replace(" ","-");                //Get the content in the search bar as the tag

    //Insert tagWiki into the Google search pape
    var wikiPosition = document.createElement("p");
    wikiPosition.id = "wiki";  
    var wikiUrl = "https://api.stackexchange.com/2.2/tags/"+tag.replace("#","%23")+"/wikis?site=stackoverflow";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", wikiUrl, false );
    xmlHttp.send();
    wikiPosition.appendChild(document.createTextNode(JSON.parse(xmlHttp.responseText)["items"][0]["excerpt"]) );
    wikiPosition.setAttribute("style", "font-size:16px;position:absolute;top:120px;left:750px;width: 500px;");
    document.body.appendChild(wikiPosition);
  
  
    //Insert a button to our own website
    var buttonPosition = document.createElement("input");
    buttonPosition.type="button";  
    buttonPosition.value = "More info";
    buttonPosition.setAttribute("style", "font-size:18px;position:absolute;top:300px;left:750px;");
    buttonPosition.id = "button";
    //buttonPosition.onclick = redirectToUrl(tag.replace("#","+++"));
    buttonPosition.onclick = redirectToUrl;
    document.body.appendChild(buttonPosition);
  
    //Insert the knowledge graph to the Google search page
    var graphPosition=document.createElement("svg");
    graphPosition.id = "graph";
    graphPosition.setAttribute("style", "font-size:18px;position:absolute;top:350px;left:750px;");
    console.log("begin", document.getElementById("lst-ib").value);
    url = "https://graphofknowledge.appspot.com/tagidjson/"+tag.replace("#","+++");
    xmlHttp.open( "GET", url, false );
    xmlHttp.send();
    //console.log(xmlHttp.responseText);
    var featureContent = JSON.parse(xmlHttp.responseText);
    //var featureContent ={"nodes": [{"group": 0, "name": "sqlite", "degree": 7}, {"group": 1, "name": "jpa", "degree": 7}, {"group": 1, "name": "spring", "degree": 8}, {"group": 4, "name": "regex", "degree": 7}, {"group": 3, "name": "user-interface", "degree": 7}, {"group": 0, "name": "concurrency", "degree": 7}, {"group": 1, "name": "mysql", "degree": 7}, {"group": 3, "name": "jbutton", "degree": 7}, {"group": 5, "name": "xml", "degree": 7}, {"group": 1, "name": "jdbc", "degree": 7}, {"group": 0, "name": "jackson", "degree": 7}, {"group": 6, "name": "servlets", "degree": 7}, {"group": 0, "name": "json", "degree": 7}, {"group": 0, "name": "android", "degree": 16}, {"group": 0, "name": "multithreading", "degree": 7}, {"group": 1, "name": "spring-security", "degree": 7}, {"group": 0, "name": "android-activity", "degree": 7}, {"group": 1, "name": "hibernate", "degree": 9}, {"group": 4, "name": "string", "degree": 7}, {"group": 5, "name": "jaxb", "degree": 7}, {"group": 3, "name": "awt", "degree": 7}, {"group": 7, "name": "maven", "degree": 7}, {"group": 1, "name": "orm", "degree": 7}, {"group": 6, "name": "jsp", "degree": 7}, {"group": 1, "name": "sql", "degree": 7}, {"group": 3, "name": "jlabel", "degree": 7}, {"group": 2, "name": "web-services", "degree": 7}, {"group": 0, "name": "android-fragments", "degree": 7}, {"group": 1, "name": "spring-mvc", "degree": 7}, {"group": 3, "name": "jframe", "degree": 7}, {"group": 6, "name": "tomcat", "degree": 7}, {"group": 0, "name": "android-layout", "degree": 7}, {"group": 4, "name": "arrays", "degree": 7}, {"group": 7, "name": "eclipse", "degree": 8}, {"group": 2, "name": "soap", "degree": 7}, {"group": 3, "name": "jtable", "degree": 7}, {"group": 3, "name": "jpanel", "degree": 7}, {"group": 7, "name": "eclipse-plugin", "degree": 7}, {"group": 3, "name": "swing", "degree": 12}, {"group": 0, "name": "android-asynctask", "degree": 7}, {"group": 0, "name": "listview", "degree": 7}, {"group": 0, "name": "android-intent", "degree": 7}], "links": [{"color": 0, "source": 0, "target": 13}, {"color": 1, "source": 1, "target": 17}, {"color": 1, "source": 2, "target": 28}, {"color": 1, "source": 2, "target": 17}, {"color": 1, "source": 2, "target": 15}, {"color": 4, "source": 3, "target": 18}, {"color": 3, "source": 4, "target": 38}, {"color": 0, "source": 5, "target": 14}, {"color": 1, "source": 6, "target": 9}, {"color": 1, "source": 6, "target": 17}, {"color": 3, "source": 7, "target": 38}, {"color": 5, "source": 8, "target": 19}, {"color": 0, "source": 8, "target": 13}, {"color": 1, "source": 9, "target": 24}, {"color": 0, "source": 10, "target": 12}, {"color": 6, "source": 11, "target": 23}, {"color": 6, "source": 11, "target": 30}, {"color": 0, "source": 12, "target": 13}, {"color": 0, "source": 13, "target": 16}, {"color": 0, "source": 13, "target": 14}, {"color": 0, "source": 13, "target": 31}, {"color": 0, "source": 13, "target": 41}, {"color": 7, "source": 13, "target": 33}, {"color": 0, "source": 13, "target": 39}, {"color": 0, "source": 13, "target": 40}, {"color": 0, "source": 13, "target": 27}, {"color": 1, "source": 17, "target": 22}, {"color": 4, "source": 18, "target": 32}, {"color": 3, "source": 20, "target": 38}, {"color": 7, "source": 21, "target": 33}, {"color": 3, "source": 25, "target": 38}, {"color": 2, "source": 26, "target": 34}, {"color": 3, "source": 29, "target": 38}, {"color": 7, "source": 33, "target": 37}, {"color": 3, "source": 35, "target": 38}, {"color": 3, "source": 36, "target": 38}]};
    document.body.appendChild(graphPosition);
    knowledgeGraph(featureContent, 500, 500, 0, "#graph");
      
}

//Only for debugging
function showAlert()
{
    alert(document.getElementById("lst-ib").value);
}


//Redirect to our own website
function redirectToUrl()
{
  window.location.assign("http://graphofknowledge.appspot.com/tagid/"+document.getElementById("lst-ib").value.replace("#","+++"));  //c# --> c+++
}


//Draw knowledge graph
function knowledgeGraph(featureContent, width_raw, height_raw, offset, position) {

var margin = {
		top: 0,
		right: 0,
		bottom: 0,
		left: offset
             },
 width = width_raw - margin.left - margin.right,
 height = height_raw - margin.top - margin.bottom;		
		
var border=1;
var bordercolor='gray';
	
var color = d3.scale.category20();

var svg = d3.select(position).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.attr("border",border)
	;

//add borther to the svg
var borderPath = svg.append("rect")
       			.attr("x", margin.left)
       			.attr("y", 0)
       			.attr("height", height)
       			.attr("width", width)
       			.style("stroke", bordercolor)
       			.style("fill", "none")
       			.style("stroke-width", border);	
	
	
var force = d3.layout.force()
    .gravity(.05)
    .charge(-100)
	.linkDistance(50)
    .size([width, height]);

	
var json = featureContent;
	
	
  //json = JSON.parse(jsondata)
	
  force
	  //.alpha(10)
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = svg.selectAll(".link")
      .data(json.links)
    .enter().append("line")
	 .style("stroke", function(d) { return color(d.color); })
      .attr("class", "link");
	

  var node = svg.selectAll(".node")
      .data(json.nodes)
	  .enter().append("g")
      .attr("class", "node")
      .call(force.drag)
	  .on('mouseover', connectedNodes)
	  .on('mouseout', allNodes)
	  .on('dblclick', reDirect);

  node.append("circle")
    .attr("r", function(d) { return d.degree;})
    .style("fill", function (d) {return color(d.group);})
	
  node.append("text")
      .attr("dx", 3)           //It means the offset of label and circle
      .attr("dy", ".35em")
      .text(function(d) { return d.name })
      .style("font-size",function(d) { return d.degree*2+'px' })
	  .style("stroke", "gray");  
	  
	  
	  
  force.on("tick", function() {
    
	var radius = 10;
	//node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
    //   .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
	
	node.attr("transform", function(d) { return "translate(" + Math.max(radius, Math.min(width - radius, d.x)) + "," + Math.max(radius, Math.min(height - radius, d.y)) + ")"; });
	
	link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

   
    
	//node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
  
 
  var linkedByIndex = {};
  for (i = 0; i < json.nodes.length; i++) 
  {
     linkedByIndex[i + "," + i] = 1;
  };
  
  json.links.forEach(
   function (d) {
    linkedByIndex[d.source.index + "," + d.target.index] = 1;
   });

   //This function looks up whether a pair are neighbours
  function neighboring(a, b) {
    
    return linkedByIndex[a.index + "," + b.index];
  }
  
  function connectedNodes() {
        //Reduce the opacity of all but the neighbouring nodes
        d = d3.select(this).node().__data__;
        //console.log(d.name);
		node.style("opacity", function (o) {
            return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
        });
        link.style("opacity", function (o) {
            return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
        });
          
}
  function allNodes()
  { node.style("opacity", 1);
    link.style("opacity", 1);}
  
  function reDirect()
  {
  d = d3.select(this).node().__data__;
  //console.log(d.name.replace("#", "%23"));
  window.location.assign("http://graphofknowledge.appspot.com/tagid/"+d.name.replace("#", "+++"));  //c# --> c%23
  //document.getElementById('tag').value= d.name;
  }
  
} 