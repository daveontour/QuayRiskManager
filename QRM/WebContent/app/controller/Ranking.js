function SorterLayout(){

   this.height = 500;
   this.width = 500;
   this.itemWidth = 500;
   this.items = null;
   this.transMatrix = [1,0,0,1,20,30];
   this.svgDiv = null;
   this.itemHeight = 25;
   this.minItemHeight = 20;
   this.minItemWidth = 120;
   this.topSVG = null;
   this.svgDiv = null;
   this.numItemsPerColumn = 0;
   this.numColumns = 0;
   this.lastColumn = 0;
   this.lastRow = 0;
   this.minScaleFactor = 0.75;
   
   var layout = this;
   
   this.drag = d3.behavior.drag()
   .on("dragstart", function(d){
     
      debugger;
      var e = d3.event.sourceEvent;
      if( e.ctrlKey) return;

      var x = d.tx+5;
      var y = d.ty+5;

      d3.select("#rankGroupHolder").append("use")
      .attr("xlink:href","#ghostDef")
      .attr("tx", x)
      .attr("ty", y)
      .attr("totTy", d.totTy )
      .attr("transform", "translate("+x+", "+y+")")
      .attr("id", "sorterGhost");

      d3.select("#rankGroupHolder").append("use")
      .attr("xlink:href","#insertionMarkerDef")
      .attr("ty", y)
      .attr("tx", x)
      .attr("transform", "translate("+x+", "+y+")")
      .attr("id", "insertionMarker")
      .style("display", "none");

      this.parentNode.appendChild(this);
   })
   .on("drag", function(){
      
      layout.notifyDirtyListeners();
      this.parentNode.appendChild(this);
      
      var yOffset = Math.floor(d3.event.y/layout.itemHeight)*layout.itemHeight;
      
      //Left boundary limit
      var posnX = Math.max(d3.event.x,0);
      
      // Right boundary limit
      posnX = Math.min(posnX, (layout.lastColumn)*layout.itemWidth);
      
      // Top boundary limit
      var posnY = Math.max(d3.event.y,-layout.itemHeight);
      
      //Bottom boundary limit
      posnY = Math.min(posnY, layout.itemHeight*layout.numItemsPerColumn);
      
      d3.select(this).attr("transform", function( d, i) { return "translate(" + [ posnX,posnY ] + ")";});
      
      var y = yOffset+(layout.itemHeight-7);
      y = Math.min(y,layout.itemHeight*layout.numItemsPerColumn-7);
      
      var col = (Math.floor(posnX/layout.itemWidth));
      var x = col*layout.itemWidth;
      
      //Last column limit
      if (col == layout.lastColumn){
         y = Math.min(y, layout.itemHeight*layout.lastRow-7);
      }
      
      //Keep it withing the lower limit for the marker.
      y = Math.max(y, -7);
      
      var totTy = col*layout.numItemsPerColumn*layout.itemHeight+y;
    
      d3.select("#insertionMarker")
      .attr("transform", function( d, i) { return "translate(" + [ x,y ] + ")"; })
      .attr("totTy", totTy)
      .attr("ty", y)
      .attr("tx", x)
      .style("display","inline");

   })
   .on("dragend", function(d){
      
      
      var ghost = d3.select("#sorterGhost");
      var marker = d3.select("#insertionMarker");
     
      var ghostTotY = Number(ghost.attr("totTy"));
      var markerTotY =  Number(marker.attr("totTy"));
      
      if (ghostTotY == markerTotY || ghostTotY == markerTotY+layout.itemHeight){
         var node= d3.select(this);
         node.attr("transform", function() { return "translate(" + [ Number(node.attr("tx")),Number(node.attr("ty")) ] + ")";});
         ghost.remove();
         marker.remove();
         return;
      }
      
      var moveUp = ghostTotY > markerTotY;

      var nodes = d3.select("#rankGroupHolder").selectAll("g.risk");
      
      if (moveUp){
         nodes.filter(function(d2,i){return (d2.totTy < ghostTotY && d2.totTy > markerTotY);}).each(function(d2,i){
               layout.calcNewPosition(d2,moveUp);
               layout.repositionNode(this,d2,moveUp);
         });
      } else {
          nodes.filter(function(d2,i){ return (d2.totTy > ghostTotY && d2.totTy <= markerTotY);}).each(function(d2,i){
                layout.calcNewPosition(d2,moveUp);
               layout.repositionNode(this,d2,moveUp);
         });
      }  

      layout.positionDropNode(this,d,marker,moveUp);

      ghost.remove();
      marker.remove();
   })
   .origin(function (d){
      var bbox = this.getBBox();
      var ctm = this.getCTM();
      return {x:bbox.x+ctm.e/ctm.a-layout.transMatrix[4]/layout.transMatrix[0], y:bbox.y+ctm.f/ctm.d - layout.transMatrix[5]/layout.transMatrix[3]};
   });

   this.setHeight = function(h){
      this.height = h;
   };

   this.setWidth = function(w){
      this.width = w;
   };

   this.setItems = function(i){
      this.items = i;
   };

   this.sortItems = function (sortFn){
      this.items.sort(sortFn);
   };

   this.scale = function(x,y){
      this.transMatrix[0] = x;
      this.transMatrix[3] = y;
   };

   this.translate = function(x,y){
      this.transMatrix[4] = x;
      this.transMatrix[5] = y;      
   };

   this.normaliseRanks = function(){
      this.items.sort(function(a,b){
         if (a.totTy != null && b.totTy != null){
            return a.totTy - b.totTy;
         } else {
            return a.rank - b.rank;
         }
      });
      var rank = 0;
      this.items.forEach(function(item){
         item.rank = rank++;
      });

   };
   
   this.notifyDirtyListeners = function(){
      if (this.dirtyListener !=null){
         this.dirtyListener();
      }
   },
   this.setDirtyListener = function(fn){
      this.dirtyListener = fn;
   },
   this.setSVGDiv = function(div){
      this.svgDiv = "#"+div;
   };

   this.setItemHeight = function(h){
      this.itemHeight = Math.max(h, this.minItemHeight);
   };

   this.setItemWidth = function(w){
      this.itemWidth = Math.max(w, this.minItemWidth);
   };
   
   this.positionDropNode = function(element, data, marker, moveUp){
      
      var dropNode = d3.select(element);
      var markerTotY =  Number(marker.attr("totTy"));
       
      data.totTy = markerTotY;

      data.tx = Number(marker.attr("tx"));
      data.ty = Number(marker.attr("ty"))+7;

      if (moveUp){
         data.totTy = data.totTy+this.itemHeight;
         
         if(data.ty > (layout.numItemsPerColumn-1)*layout.itemHeight){
            data.ty = 0;
            data.tx = data.tx+layout.itemWidth;
         }

      } else {
         data.ty = data.ty-this.itemHeight;
         
         if(data.ty < 0){
            data.ty = (layout.numItemsPerColumn-1)*layout.itemHeight;
            data.tx = data.tx-layout.itemWidth;
         }
      }
      dropNode.transition().attr("transform", "translate("+[data.tx, data.ty ]+")");      
   };
   
   this.calcNewPosition = function(item, moveUp){
      
      if (moveUp){
         item.totTy = item.totTy+layout.itemHeight;
         item.ty = item.ty+layout.itemHeight;
         
         if(item.ty > (layout.numItemsPerColumn-1)*layout.itemHeight){
            item.ty = 0;
            item.tx = item.tx+layout.itemWidth;
         }
      } else {
         item.totTy = item.totTy-layout.itemHeight;               
         item.ty = item.ty-layout.itemHeight;
         
         if(item.ty < 0){
            item.ty = (layout.numItemsPerColumn-1)*layout.itemHeight;
            item.tx = item.tx-layout.itemWidth;
         }
      }
      

   }; 
   
   this.repositionNode = function(element, data, moveUp){
     d3.select(element).transition().attr("transform", function(){ 
         return "translate("+[ data.tx, data.ty ]+")";
      });     
   };
    
   this.preLayout = function(){
      
      var numItems = this.items.length;
      
      var totalItemHeight = (numItems+1.5)*this.itemHeight;
      
      var colNum = 1;
      var scaleFactor = 0;
      do {
         var columnHeight = totalItemHeight/colNum;
         scaleFactor = this.height/columnHeight;
         colNum++;
      } while (scaleFactor < this.minScaleFactor)
         
      this.scale(1, Math.min(1,scaleFactor));

      //Scale to make full use of height and add some margin at the botom
      
      this.layoutHeight = this.height/this.transMatrix[3]- 1.5*this.itemHeight/this.transMatrix[3];
      this.numItemsPerColumn = Math.floor(this.layoutHeight/this.itemHeight);
      
      colNum = Math.ceil(numItems/this.numItemsPerColumn);      
      this.setItemWidth((this.width-10-this.transMatrix[4])/(colNum));
      
        
   };

   this.layoutTable = function(){
      
      this.preLayout();

      d3.select(this.svgDiv+" svg").remove();

      this.topSVG = d3.select(this.svgDiv).append("svg")
      .attr("width", this.width)
      .attr("height", this.height); 

      this.createDefinitions(); 
      
      this.topSVG.append("text")
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("font-weight", "normal")
      .attr("transform", "translate(" + [ this.width/2, 20 ] + ")")
      .text( QRM.global.project.projectTitle);

      this.svg = this.topSVG
      .append("g")
      .attr("id", "rankGroupHolder")
      .attr("h", this.height)
      .attr("transform", "matrix("+ this.transMatrix.join(' ')+")");

      var me = this;
      var rowNum = 0;
      var colNum = 0;
      this.items.forEach(function(item){
         
           item.ty = rowNum*me.itemHeight;
           item.tx = colNum*me.itemWidth;
           item.totTy = item.ty+colNum*me.itemHeight*me.numItemsPerColumn;
           
           rowNum++;
           if (rowNum == me.numItemsPerColumn){
              colNum++;
              rowNum = 0;
           }        
      });
      
      this.lastColumn = colNum;
      this.lastRow = rowNum;

      var nodes = this.svg.selectAll( "g.state").data( this.items);

      var risk = nodes.enter()
      .append("g")
      .attr("class","risk")
      .attr("id", function(d){return d.riskCode;})
      .attr("tx", function(d){return d.tx;})
      .attr("colY", function(d){return d.colY;})
      .attr("transform", function(d,i){ return "translate("+d.tx+", "+d.ty+")";})
      .attr("ty", function(d,i){ return d.ty;})
      .on("mouseover", function(d){
         var html = "<div style='valign:top'><br><hr><strong>" + d.riskProjectCode + " - " + d.title + "<br><br>Description:<br><br></strong>" + d.description.substring(0, 500) + "<hr></div>";
         Ext.getCmp('qrm-rankDetail').update(html);
      })
      .on("click", function(d){
         debugger;
          var e = d3.event;
          if( !e.ctrlKey) return;
          if (d3.event.defaultPrevented) return; 
          if (QRM.app.getRankingController().dirty){
             msg("Open Risk", "Please save or cancel existing changes before opening the risk");
          } else {
             QRM.app.getRankingController().listenForEditorChanges = true;
             getRiskCodeAndDisplayInt(d.riskProjectCode); 
          }
        })
      .call(this.drag); 
      
      risk.append("rect")
      .attr("width", this.itemWidth-10)
      .attr("height", this.itemHeight-5)
      .attr("fill", 'aliceblue')
      .style("stroke", 'gray')
      .attr("class", 'tolText')
      .attr("transform", "translate(5,5)");
      
      risk.append("rect")
      .attr("width", "100")
      .attr("height", this.itemHeight-8)
      .attr("class", function(d){
         var tol = null;
         if (d.treated){
            tol = d.treatedTolerance;
         } else {
            tol = d.inherentTolerance;
         }
         return "tol"+tol;
         })
      .style("stroke", 'gray')
      .attr("transform", "translate(7,7)");
      
      risk.append("text")
      .style("pointer-events","none")
      .attr("transform", "translate(10,25)")
      .text(function(d){return d.riskProjectCode;});
      
      var textGroup = risk.append("g")
      .attr("transform", "translate(110,25)");
      
      textGroup.append("clipPath")
      .attr("id", function(d){return "clipPath"+d.riskProjectCode;})
      .append("rect")
      .attr("transform","translate(0,-20)")
      .attr("width", this.itemWidth-120)
      .attr("height",this.itemHeight);
      
      textGroup.append("text")
      .style("pointer-events","none")
      .attr("clip-path", function(d){return "url(#clipPath"+d.riskProjectCode+")"})
      .text(function(d){return d.title;});

   };

   this.createDefinitions = function(){
      var def = this.topSVG.append("defs");

      def.append("style")
      .attr("type", "text/css")
     .text(
            ".compass{fill: #fff; stroke: #000;stroke-width:   1.5; }" +
            ".button{ fill: #225EA8; stroke: #0C2C84; stroke-miterlimit: 6; stroke-linecap:  round; }" +
            ".button:hover{ stroke-width: 2; }" +
            ".plus-minus{ fill: #fff; pointer-events: none; }" +
             "g.risk {cursor:move }" +
            ".marker {stroke-width: 4px; stroke-dasharray: 4px; stroke:red}" +
            ".markervert {stroke-width: 4px; stroke:red}" +
            "rect.subRankText {fill: aliceblue ;stroke: gray;}" +
            "rect.subRankText:hover {fill: #157fcc ;stroke: gray;}" +
            "rect.tol5 {fill: #ff0000;stroke: #E6E6E6;stroke-width: 2px; }" +
            "rect.tol4 {fill: #ffa500;stroke: #E6E6E6;stroke-width: 2px; }" +
            "rect.tol3 {fill: #ffff00;stroke: #E6E6E6;stroke-width: 2px; }" +
            "rect.tol2 {fill: #00ff00;stroke: #E6E6E6;stroke-width: 2px; }" +
            "rect.tol1 {fill: #00ffff; stroke: #E6E6E6; stroke-width: 2px; }" +
            "g.risk text { font: 12px sans-serif; font-weight : normal; pointer-events : none; }"+
            "g.state text.treated { fill:blue; font: 12px sans-serif; font-weight : bold; pointer-events : none; }");

      // Create the insertion marker definition
      var marker = def.append("g").attr("id", "insertionMarkerDef");

      marker.append("line")
      .attr("x1", "1")
      .attr("y1", "0")
      .attr("x2", "1")
      .attr("y2", "19")
      .attr("class", "markervert");

      marker.append("line")
      .attr("x1", this.itemWidth-4)
      .attr("y1", "0")
      .attr("x2", this.itemWidth-4)
      .attr("y2", "19")
      .attr("class", "markervert");

      marker.append("line")
      .attr("x1", "1")
      .attr("y1", "9")
      .attr("x2", this.itemWidth-4)
      .attr("y2", "9")
      .attr("class", "marker");

      //Create the ghost holder definition
      def.append("g").attr("id", "ghostDef").append("rect")
      .attr("width", this.itemWidth-10)
      .attr("height", this.itemHeight-5)
      .style("stroke", 'gray')
      .style("fill", 'transparent')
      .style("stroke-dasharray", '4px');
      
      def.append("clipPath")
      .attr("id", "rankTextClipPath")
      .append("rect")
      .attr("width", this.itemWidth-10)
      .attr("height", this.itemHeight-5)
      .attr("transform", "translate(5,5)"); 
      
   };   
} 

Ext.define('QRM.controller.Ranking', {
   extend: 'Ext.app.Controller',
   views:['rank.RankInfo', 'rank.RankWindow'],
   stores:['Rank'],
   dirty:false,
   layout:null,
   listenForEditorChanges:false,
   editorChanges:false,
   init: function () {    
      this.control(
            {'qrmXType-riskEditor' :{
               riskChanges:this.riskChanges
            }
            });
      
      this.control({'qrmXType-riskEditor':{
         close:this.riskEditorClose
         }});     

 },
  riskEditorClose:function(){
         if (this.listenForEditorChanges && this.editorChanges){
            this.switchProject(QRM.global.project, $$('cbDescendants').value);
         }
         this.listenForEditorChanges = false;
         this.editorChanges = false;
      },    
  riskChanges:function(){
     this.editorChanges = true;
  },
   okToSwitchProject: function(newProjectID){
      if (!this.dirty) {
         return true;
     } else {
         this.dirtySwitch(null, null, newProjectID);
         return false;
     } 
   },
   okToSwitchTab: function(tabPanel, newCard){
      if (!this.dirty) {
         return true;
     } else {
         this.dirtySwitch(tabPanel, newCard);
         return false;
     }
   },
   switchTab: function(){
//      if (this.dirty) return false;
      this.loadGrid();
  //    this.layoutTable();
   },
   dirtySwitch:function(tabPanel, newCard, newProjectID){
      
      Ext.Msg.show({
         title: "Save Changes",
         msg: '<center>Save Changes?</center>',
         width: 300,
         buttons: Ext.Msg.YESNOCANCEL,
         fn: function(btn){
            
            if (btn == 'cancel'){
               var store = $$("qrmNavigatorID").getStore();
               var record = store.findRecordByProjectID(QRM.global.projectID);
               $$("qrmNavigatorID").getSelectionModel().select(record);               
               return;
            }

            if (btn == 'no') {
               QRM.app.getRankingController().dirty = false;
               if (tabPanel != null){
                  tabPanel.setActiveTab(newCard);
               } else if (newProjectID != null){
                  var store = $$("qrmNavigatorID").getStore();
                  var record = store.findRecordByProjectID(newProjectID);
                  $$("qrmNavigatorID").getSelectionModel().select(record);
                  QRM.app.getMainTabsController().getProject(newProjectID);
               }
               return;
            }
            if (btn == 'yes') {
               QRM.app.getRankingController().saveChanges(true, tabPanel, newCard, newProjectID);
                return;
            }            

         },
        icon: Ext.Msg.QUESTION
     });
   },
   resizePanel:function(){
      this.layoutTable();
   },
   switchProject : function(project, desc){
      this.loadGrid();
   },

   loadGrid:function(){
      
      Ext.Ajax.request({
         url: "/getRiskLiteFetchSorted",
         disableCaching: true,
         params: {
            "DESCENDANTS": false,
            "PROJECTID": QRM.global.projectID
         },
         success: function (response) {
            var risks = Ext.decode(response.responseText);
            QRM.app.getRankingController().dirty = false;
            QRM.app.getRankingController().risks = risks;
            QRM.app.getRankingController().layout = new SorterLayout();
            
            var html = "<div style='valign:top'><br><hr><br/>Rearrange the rank order of the risks by dragging and droping the risks. <br/><br/>The risks are initially arranged in rank order from top to bottom, left to right<br/><br/></strong><hr></div>";
            $$('qrm-rankDetail').update(html);

            
            myLayout = QRM.app.getRankingController().layout;
            myLayout.setHeight($$('qrm-SubRankPanel').getHeight());
            myLayout.setWidth($$('qrm-SubRankPanel').getWidth());
            myLayout.setItemHeight(35);
            myLayout.setItemWidth($$('qrm-SubRankPanel').getWidth()/2);
            myLayout.scale(1,1);
            myLayout.setItems(QRM.app.getRankingController().risks);
            myLayout.setSVGDiv("subRankSVGDiv");
            myLayout.setDirtyListener(function(){QRM.app.getRankingController().dirty = true;});
            myLayout.layoutTable();
         }
     });
      
       if ($$('cbDescendants').value){
         Ext.Msg.show({
            title: 'Descendant Project',
            msg: '<center>Descendant Projects are excluded from the ranking table</center>',
            width: 500,
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.WARNING
        });
      }
      this.dirty = false;
   },
   saveChanges: function (switchTab, tabPanel, newCard, newProjectID) {
      
      this.layout.normaliseRanks();
     
    var ranks = "";
     this.risks.forEach(function(risk){
       debugger;
       ranks = ranks+"##"+risk.riskID;
    });

    var savingbox = Ext.MessageBox.wait('Please wait while changes are savaed', 'Saving Data', {
         interval: 100,
         animate: true,
         text: 'Saving..'
     });
      Ext.Ajax.request({
         url: "./updateRanksRPC",
         params: {
            "RANKS": ranks,
            "PROJECTID": QRM.global.projectID
         },
         success: function (response) {
            QRM.app.getRankingController().dirty = false;
             savingbox.hide();
             if (switchTab){
                 if (tabPanel != null){
                   tabPanel.setActiveTab(newCard);
                } else if (newProjectID != null){
                   var store = $$("qrmNavigatorID").getStore();
                   var record = store.findRecordByProjectID(newProjectID);
                   $$("qrmNavigatorID").getSelectionModel().select(record); 
                   QRM.app.getMainTabsController().getProject(newProjectID);
                }
             } else {
                QRM.app.getRankingController().loadGrid();
             }
             return;
         }
     });
   }
   });