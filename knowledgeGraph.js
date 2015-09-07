// ==UserScript==
// @name        knowledgeGraph
// @namespace   Chen Chunyang
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
    , 200
);

function gmMain () {
    console.log ('A "New" page has loaded.');           //for debugging
    // DO WHATEVER YOU WANT HERE.
    var checkWiki = document.getElementById("wiki") ;
    var checkGraph = document.getElementById("graph");
    var checkLink = document.getElementById("link");
    
    if  ( checkWiki != null || checkGraph != null || checkLink != null)    //delete the dom if exists
    {
      checkWiki.parentNode.removeChild(checkWiki);
      checkGraph.parentNode.removeChild(checkGraph);
      checkLink.parentNode.removeChild(checkLink);
    }
  
    var input = document.getElementById("lst-ib").value.toLowerCase();                //Get the content in the search bar as the tag (lowercase and replace blank)
    if (input.split(" ").length<6)                                                    // no more than 5 spaces in the input
    {
        var xmlHttp = new XMLHttpRequest();
        
        //Get graph content
        console.log(input.replace(/#/g,"+++").replace(/ /g,"&&"));                    //"replace" method can only replace the first occurrence, so we use regex here
        xmlHttp.open( "GET", "https://graphofknowledge.appspot.com/tagidjson/"+input.replace("#","+++").replace(/ /g,"&&"), false );
        xmlHttp.send();
        var tag = xmlHttp.responseText.split("&&")[0];                         //the tag
        var graphResult = xmlHttp.responseText.split("&&")[1];                 //the kg graph
        
        
        
        //Get tagWiki content
        var wikiUrl = "https://api.stackexchange.com/2.2/tags/"+tag.replace(/#/g,"%23")+"/wikis?site=stackoverflow";
        xmlHttp.open( "GET", wikiUrl, false );
        xmlHttp.send();
        var wikiResult = xmlHttp.responseText;



        if (JSON.parse(wikiResult)["items"].length != 0 && graphResult != ""  )  //no wiki data or no graph data
        {

            var baseHeight = 120 + $('#rhs').height();          //Align our answer panle behind Google's direct answer or ads. Google's navigation bar height = 120

            //Insert tagWiki into the Google search pape
            var wikiPosition = document.createElement("p");
            wikiPosition.id = "wiki";  
            wikiPosition.appendChild(document.createTextNode(jQuery('<p>' + JSON.parse(wikiResult)["items"][0]["excerpt"] + '</p>').text()));    //jQuery(wiki).text() is to convert HTML to string.
            wikiPosition.setAttribute("style", "font-size:16px;position:absolute;top:"+baseHeight+"px;left:700px;width: 500px;");
            document.body.appendChild(wikiPosition);
            var wikiHeight = $('#wiki').height();                   //the height of wiki paragraph

            //Insert a link to our own website
            var linkPosition = document.createElement("p");
            linkURL = "https://graphofknowledge.appspot.com/tagid/" +tag.replace(/#/g,"+++");
            linkPosition.innerHTML = "Refer to <a href = \""+linkURL+"\">" + linkURL + "</a>" ;
            //linkPosition.appendChild();
            linkPosition.setAttribute("style", "font-size:15px;position:absolute;top:"+(baseHeight+wikiHeight+10)+"px;left:700px;");
            linkPosition.id = "link";
            //buttonPosition.onclick = redirectToUrl(tag.replace("#","+++"));
            document.body.appendChild(linkPosition);

            //Insert the knowledge graph to the Google search page
            var graphPosition=document.createElement("svg");
            graphPosition.id = "graph";
            graphPosition.setAttribute("style", "font-size:18px;position:absolute;top:"+(baseHeight+wikiHeight+70)+"px;left:700px;");
            //console.log("begin", document.getElementById("lst-ib").value);
            var graphContent =  JSON.parse(graphResult);
            document.body.appendChild(graphPosition);
            var edgeDistance = 80*graphContent["links"].length/graphContent["nodes"].length;      //the edge distance depends on the ratio of edge and node number
            //console.log(graphContent["links"].length, graphContent["nodes"].length, edgeDistance);
            knowledgeGraph(graphContent, 500, 500, 0, edgeDistance, "#graph");
        }
    }
}

//Only for debugging if we get the input
function showAlert()
{
    alert(document.getElementById("lst-ib").value);
}



//Draw knowledge graph
function knowledgeGraph(featureContent, width_raw, height_raw, offset, distance, position) {

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
    .charge(-130)
	  .linkDistance(distance)
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
	    //.on('mousedown', tip.show)  
      //.on('mouseup', tip.hide)  //.on('mouseleave', tip.hide)
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