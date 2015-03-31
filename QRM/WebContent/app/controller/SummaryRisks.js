/**
 * 
 */
Ext.define('QRM.controller.SummaryRisks', {
    extend: 'Ext.app.Controller',
    models:['QRM.model.LiteRisk'],
    stores: ['RiskTree'],
    views: [
        'summary.SummaryPanel',
        'summary.RiskGrid',
        'summary.SummaryTree'],
    dirtyRecords:new Array(),
    init:function(){
       this.control(
             {'#qrm-SummaryRiskCancelBtnID': {
                click: this.handleCancelChanges
             }
             }); 
       this.control(
             {'#qrm-SummaryRiskSaveBtnID': {
                click: this.handleSaveChanges
             }
             }); 
    },
    okToSwitchProject: function () {
        return true;
    },
    okToSwitchTab: function () {
        return true;
    },
    switchTab: function () {
        this.switchProject(QRM.global.project, $$('cbDescendants').value);
    },
    resizePanel: function () {
        this.switchProject(QRM.global.project, $$('cbDescendants').value);
    },
    handleCancelChanges:function(){
       this.dirty = false;
       this.dirtyRecords = new Array();
       this.switchProject(QRM.global.project, $$('cbDescendants').value);
       Ext.getStore('trashTargetStore').loadData([]);
    },
    handleSaveChanges:function(){
       
       var changes = new Array();
       var me = this;
       
       Ext.Array.each(me.dirtyRecords, function(risk){
          console.log(risk);
          changes.push({
             "riskID": risk.riskID,
             "newParentSummaryRisk": risk.newParentSummaryRisk,
             "parentSummaryRisk": risk.parentSummaryRisk,
             "origParentSummaryRisk": risk.origParentSummaryRisk,
             "tempIndex": risk.tempIndex,
             "relationshipID": risk.relationshipID,
             "removeChild":risk.removeChild
          });
       });

       
       Ext.Ajax.request({
          url: "./updateFamilyRPC",
          params: {
             "PROJECTID": QRM.global.projectID,
             "CHANGES": JSON.stringify(changes)
          },
          success: function(response){
             me.dirty = false;
             me.switchProject(QRM.global.project, $$('cbDescendants').value);        
          }

       });
    },
    switchProject: function (project, desc) {
        this.dirty = false;
        this.dirtyRecords = new Array();

        Ext.getStore('trashTargetStore').loadData([]);
        Ext.data.StoreManager.get('Explorer').load({
            params: {
                "DESCENDANTS": desc,
                    "PROJECTID": QRM.global.projectID,
                    "PROCESSFILTER": true,
                    "TOLEX": true,
                    "TOLHIGH": true,
                    "TOLSIG": true,
                    "TOLMOD": true,
                    "TOLLOW": true,
                    "STATACTIVE": true,
                    "STATPENDING": true,
                    "STATINACTIVE": true,
                    "STATTREATED": true,
                    "STATUNTREATED": true,
                    "CATID": -1,
                    "OWNERID": -1,
                    "MANAGERID": -1
            }
        });

        var store = Ext.data.StoreManager.get('RiskTree');
        
        // Set the proxy for the store
        
        store. setProxy({
           type: 'ajax',
           url: '/getRiskLiteRPC',
           reader: {
               type: 'json',
               root: 'risks'
           }
       });
        
        store.load({
            params: {
                "ULTRALITE": true,
                    "DESCENDANTS": desc,
                    "PROJECTID": QRM.global.projectID,
                    "FAMILY": true,
                    "EXTTREE": true
            }
        });
        
        
        flare = {
              "riskID" : "",
              "title" : "Quay Systems",
              "tolerance" : 5,
              "summaryRisk" : false,
              "children" : [ {
                 "riskID" : "RK2",
                 "title" : "Second Risk",
                 "tolerance" : 4,
                 "summaryRisk" : true,
                 "children" : [ {
                    "riskID" : "RK3",
                    "title" : "Second Risk",
                    "tolerance" : 3,
                    "summaryRisk" : false
                 }, {
                    "riskID" : "RK4",
                    "title" : "Third Risk",
                    "tolerance" : 2,
                    "summaryRisk" : false
                 } ]
              }, {
                 "riskID" : "RK5",
                 "title" : "Third Risk",
                 "tolerance" : 1,
                 "summaryRisk" : true,
                 "children" : [ {
                    "riskID" : "RK6",
                    "title" : "Second Risk",
                    "tolerance" : 1,
                    "summaryRisk" : false
                 }, {
                    "riskID" : "RK7",
                    "title" : "Third Risk",
                    "tolerance" : 2,
                    "summaryRisk" : false
                 }, {
                    "riskID" : "RK8",
                    "title" : "Second Risk",
                    "tolerance" : 3,
                    "summaryRisk" : false
                 }, {
                    "riskID" : "RK9",
                    "title" : "Third Risk",
                    "tolerance" : 4,
                    "summaryRisk" : false
                 }, {
                    "riskID" : "RK10",
                    "title" : "Second Risk",
                    "tolerance" : 5,
                    "summaryRisk" : false
                 }, {
                    "riskID" : "RK11",
                    "title" : "Third Risk",
                    "tolerance" : 4,
                    "summaryRisk" : false
                 } ]
              },{
                 "riskID" : "RK20",
                 "title" : "Third Risk",
                 "tolerance" : 3,
                 "summaryRisk" : true}
              ]
           };

        d3.select("#svgBoxTree").remove();
            margin = { top : 0, right : 20, bottom : 30, left : 0};
            width = 960 - margin.left - margin.right;
            barWidth = 200;
           
            bh = 20;
           hh = Math.max(bh,20);
            midY = bh/2;
            polyVert = bh - 6;
            polyXDisplacement = polyVert/2+10;
            polyVertLowerY = polyVert + 3;
            yRotationPoint = polyVert/2+3;
            circleRadius = bh/4;
            circleXCenter = polyXDisplacement+10+circleRadius;
            textOffset = circleXCenter+circleRadius+5;
            fontSize = bh/2;
           fontSize = Math.max(fontSize,12);
            fontY = midY+fontSize/4;
            i = 0, duration = 400, dragging = false;
            tree = d3.layout.tree().nodeSize([ 100, 20 ]);
            diagonal = d3.svg.diagonal().projection(function(d) { return [ d.y, d.x ];  });
            topSVG = d3.select("#relationshipTree").attr("width", width + margin.left + margin.right);
            svg = topSVG.append("g").attr("id", "svgBoxTree").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
           

            root = null;

           flare.x0 = 0;
           flare.y0 = 0;
           update(root = flare);


        
    }
});


function update(source) {

   var drag = d3.behavior.drag()
   .on("dragstart", function(d) {
            if (d.children || d._children || d.summaryRisk) {
               return;
            }
            dragging = true;
            d3.select(this).attr('pointer-events', 'none');

            var ev = d3.mouse(document.getElementById('svgBoxTree'));
            var x = ev[0];
            var y = ev[1];

            var dragNode = d3.select("#svgBoxTree").append("g")
            .attr("id", "treeDragNode")
            .attr("class", "node")
            .attr("parentID", d.riskID)
            .attr("x0", d.y)
            .attr("y0", d.x)
            .attr("transform", "translate(" + x + "," + y + ")");

            dragNode.append("text").attr("dy", 10).attr("dx", 5.5).text(d.riskID + " - " + d.title);
         }
   )
   .on("drag", function(d) {
      if (d.children || d._children || d.summaryRisk) {
         return;
      }
      var ev = d3.mouse(document.getElementById('svgBoxTree'));
      var x = ev[0];
      var y = ev[1];

      d3.select("#treeDragNode").attr("transform", "translate(" + x + "," + y + ")");
   }
   ).on("dragend", function(d) {

      d3.select(this).attr('pointer-events', '');
      dragging = false;
      d3.select("#treeDragNode").remove();

      var updateParent = null;

      // Add it to the selected parent
      flare.children.forEach(function(parent) {
         if (parent.children) {
            if (parent.selectedParent) {
               if (parent.children.indexOf(d) == -1) {
                  parent.children.push(d);
               }
               updateParent = parent;
            }
         } else if (parent._children) {
            if (parent.selectedParent) {
               if (parent._children.indexOf(d) == -1) {
                  parent._children.push(d);
                  // Make the parent appear expanded if a child is dropped on it
                  parent.children = parent._children;
                  parent._children = null;
               }
               updateParent = parent;
            }
         } else if (parent.summaryRisk) {
            if (parent.selectedParent) {
               parent.children = new Array();
               childPlaced = true;
               parent.children.push(d);
               updateParent = parent;
            }
         }
      });

      //Remove it from the old parent, if placed
      flare.children.forEach(function(parent) {
         if (updateParent != null) {
            if (!parent.selectedParent) {
               if (parent.children) {
                  var index = parent.children.indexOf(d);
                  if (index > -1) {
                     parent.children.splice(index, 1);
                  }
               }
               if (parent._children) {
                  var index = parent._children.indexOf(d);
                  if (index > -1) {
                     parent._children.splice(index, 1);
                  }
               }
            }
         }
         parent.selectedParent = false;
      });

      if (updateParent != null) {
         update(root = flare);
      } else {
         return;
      }
   }
   )
   .origin(function(d) {
      var bbox = this.getBBox();
      var ctm = this.getCTM();
      return { x : bbox.x, y : bbox.y };
   });


   // Compute the flattened node list. TODO use d3.layout.hierarchy.
   var nodes = tree.nodes(root);
   var height = Math.max(2000, nodes.length * bh + margin.top + margin.bottom);

   d3.select("#relationshipTree").transition().duration(duration).attr("height", height);
   d3.select(self.frameElement).transition().duration(duration).style("height", height + "px");

   // Compute the "layout".
   // x and y get turned around because of the nature of the tree layout
   nodes.forEach(function(n, i) { n.x = i * bh; });

   // Update the nodes…  
   // node = existing nodes
   // nodeEnter = new nodes that will appear

   var node = svg.selectAll("g.node").data(nodes, function(d) { return d.id || (d.id = ++i); });

   //Enter any new nodes at the parent's previous position.
   var nodeEnter = node.enter().append("g")
   .attr("class", function(d){
      if (d.parent){
         if (d.children || d._children || d.summaryRisk){
            return "parentnode node";
         } else {
            return "node";
         }
      } else {
         return "root node";
      }
    })
   .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
   .style("opacity", 0);
   
   var row = nodeEnter.append("g");
   
   row.append("polygon")
   .attr("points", function(d){ 
      if(d.children || d._children || d.summaryRisk){
      return "10,3 10,"+polyVertLowerY+", "+polyXDisplacement+","+midY;
      } else {
         return "0,0 "; 
      }})
   .attr("class", function(d){
      if(d.children || d._children){
         return "children";
         } else {
            return "nochildren"; 
         }            
   })
   .style("stroke", "black")
   .style("stroke-width", "1");
   
   
   row.append("circle")
   .attr("cx",circleXCenter)
   .attr("cy",midY)
   .attr("r",circleRadius)
   .style("stroke-width", "1.5px")
   .style("stroke","black")
  .attr("class", function (d){
     return "tol"+d.tolerance;
  });

   row.append("text")
   .attr("transform", "translate("+textOffset+","+fontY+")")
   .style("font-size", fontSize+"px")
   .text(function(d) {
      return d.riskID + " - " + d.title;
   });

   nodeEnter.append("rect")
   .attr("y", 0)
   .attr("x", function(d) { return -d.y;})
   .attr("height", bh)
   .attr("width", 300)
   .style("fill", "aliceblue")
   .style("opacity", 0)
   .on("mouseover",function(d) {
            if (!dragging){
               d3.select(this).style("opacity", 0.25);
            }
            if (dragging && (d.summaryRisk || d.children || d._children) && d.parent) {
               d.selectedParent = true;
               d3.select(this).style("opacity", 0.25);
            }
         })
   .on("mouseout", function(d) {
      d3.select(this).style("opacity", 0);
      d.selectedParent = false;
   })
   .on("click", click)
   .call(drag);

   //Transition nodes to their new position.
   nodeEnter.transition().duration(duration)
   .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")";})
   .style("opacity", 1);

   node.transition().duration(duration)
   .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")";})
   .style("opacity", 1);
   
   //Change the polygon class of the parent to indicate children or not.

    node.select("polygon")
    .attr("class", function(d){
      if(d._children){
         return "children";
         } else {
            return "nochildren"; 
         }            
   })
   .attr("transform", function(d){
      if(d.children){
         return "rotate(45,10,"+yRotationPoint+")";
      } else {
         return "rotate(0)"; 
      }            
   });


   // Transition exiting nodes to the parent's new position.
   node.exit().transition().duration(duration)
   .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")";})
   .style("opacity", 1e-6).remove();

   // remove the root node
   d3.select("g.root").remove();
   
   // Stash the old positions for transition.
   nodes.forEach(function(d) { d.x0 = d.x;  d.y0 = d.y; });
}


   // Toggle children on click.
   function click(d) {
      debugger;
      if (d.children) {
         d._children = d.children;
         d.children = null;
      } else {
         d.children = d._children;
         d._children = null;
      }
      update(d);
   }
