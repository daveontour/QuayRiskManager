/**
 * 
 */

Ext.define('QRM.controller.RelMatrix', {
    extend: 'Ext.app.Controller',
    currentItems: new Array(),
    matrixDirty: false,
    listenForEditorChanges:false,
    editorChanges:false,
    transMatrix:[1,0,0,1,0,0],
    views: ['relmatrix.RelMatrixSelector', 'relmatrix.RelMatrixWindow'],

    init: function () {
        this.control({
            'qrm-relMatrixItem': {
                move: this.itemMoved
            }
        });
        this.control({
            '#qrm-RelMatCancelChangesBtn': {
                click: this.cancelChanges
            }
        });
        this.control({
            '#qrm-RelMatSaveChangesBtn': {
                click: this.saveChangesWrapper
            }
        });
        this.control({
            '#qrm-RelMatStateID': {
                change: this.stateSelectorChanged
            }
        });
        this.control(
              {'#comboRiskOwnerMat' :{
                 select:this.ownerSelect
              }
              });
        this.control(
              {'#comboRiskManagerMat' :{
                 select:this.managerSelect
              }
              });
        this.control(
              {'#comboFindRiskMat' :{
                 select:this.riskSelect
              }
              });
        
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
              this.getRisksAndPlace();
           }
           this.listenForEditorChanges = false;
           this.editorChanges = false;
        },    
    riskChanges:function(){
       this.editorChanges = true;
    },
    stateSelectorChanged: function (form, newVal, oldVal) {

       // Move indicator to new location
       var status =  $$('qrm-RelMatStateID').items.get(0).getGroupValue();
       var maxProb = QRM.global.project.matrix.maxProb;

       d3.selectAll( "g.state")
       .transition()
       .duration(2000)
       .attr("transform", function( d, i) {
          var prob =  null;
          var impact = null;
          switch (status){
             case 0:
                if (d.treated){
                   prob = (d.treatedClean)?d.treatedProb:d.newTreatedProb;
                   impact = (d.treatedClean)?d.treatedImpact:d.newTreatedImpact;
                } else {
                   prob = (d.untreatedClean)?d.inherentProb:d.newInherentProb;                   
                   impact = (d.untreatedClean)?d.inherentImpact:d.newInherentImpact;                   
                }
                 break;
             case 1:
                if (d.untreatedClean){
                   prob = d.inherentProb;
                   impact = d.inherentImpact;
                } else {
                   prob = d.newInherentProb;
                   impact = d.newInherentImpact;                   
                }
                break;
             case 2:
                if (d.treatedClean){
                   prob = d.treatedProb;
                   impact = d.treatedImpact;
                } else {
                   prob = d.newTreatedProb;
                   impact = d.newTreatedImpact;
                }
                break;
                
          }
          
          var x = (impact - 1) * QRM.global.relMatrixGridSizeX;
          var y = (maxProb+1-prob) * QRM.global.relMatrixGridSizeY;

          d.x = x;
          d.y = y;
           return "translate("+ [d.x,d.y] + ")";
      });
       
       var state = "Current State";
       var status =  $$('qrm-RelMatStateID').items.get(0).getGroupValue();
       switch (status){
             case 0:
                state = "Current State";
                break;
             case 1:
                state = "Un Treated State";
                break;
             case 2:
                state = "Treated State";
                break;
                
        }
       
       d3.select("#relMatrixSubHeading").text(state);
       
    },
    
    cancelChanges: function () {
        this.matrixDirty = false;
        this.risks.forEach(function(risk){
           risk.untreatedClean = true;
           risk.treatedClean = true;
           risk.dirty = false;
        });
        // Move the risks back to where they should be.
        this.stateSelectorChanged();
    },
    saveChangesWrapper:function(){
      this.saveChanges(false); 
    },
    saveChanges: function (switchTab, tabPanel, newCard, newProjectID) {
       
       var savingbox = Ext.MessageBox.wait('Please wait while changes are savaed', 'Saving Data', {
          interval: 100,
          animate: true,
          text: 'Saving..'
      });
        var relMatChanges = new Array();
        
        this.risks.forEach(function(item){
           if (item.dirty){
              debugger;
              console.log(item.untreatedClean +" "+item.inherentImpact+ " "+item.newUntreatedImpact);
              relMatChanges.push({
                 riskID: item.riskID,
                 newTreatedImpact: (item.treatedClean) ? item.treatedImpact : item.newTreatedImpact,
                 newTreatedProb: (item.treatedClean) ? item.treatedProb : item.newTreatedProb,
                 newUntreatedImpact: (item.untreatedClean) ? item.inherentImpact : item.newUntreatedImpact,
                 newUntreatedProb: (item.untreatedClean) ? item.inherentProb : item.newUntreatedProb
              });             
           }
        });

        Ext.Ajax.request({
           url: "./updateRelMatrix",
           params: {
              "DATA": JSON.stringify(relMatChanges),
              "PROJECTID": QRM.global.projectID
           },
           success: function (response) {
              debugger;
              if (switchTab){
                 if (tabPanel != null){
                    QRM.app.getRelMatrixController().matrixDirty = false;
                    tabPanel.setActiveTab(newCard);
                 } else if (newProjectID != null){
                    var store = $$("qrmNavigatorID").getStore();
                    var record = store.findRecordByProjectID(newProjectID);
                    $$("qrmNavigatorID").getSelectionModel().select(record); 
                    QRM.app.getMainTabsController().getProject(newProjectID);
                 }
              } else {
                 QRM.app.getRelMatrixController().getRisksAndPlace();
                 QRM.app.getRelMatrixController().matrixDirty = false;
              }
               
              savingbox.hide();
               return;
           }
       });
    },
    getState: function () {
        return $$('qrm-RelMatStateID').getValue().tolstate;
    },
    ownerSelect:function(){
       var ownerID = $$('comboRiskOwnerMat').value;
       $$('comboRiskManagerMat').clearValue();
       $$('comboFindRiskMat').clearValue();
       var filteredRisks = new Array();
       
      
       this.risks.forEach(function(risk){
           if (risk.ownerID == ownerID){
             filteredRisks.push(risk);
          } 
       });
       
       this.svgMatrix(filteredRisks);
    },
    managerSelect:function(){
       var managerID = $$('comboRiskManagerMat').value;
       $$('comboRiskOwnerMat').clearValue();
       $$('comboFindRiskMat').clearValue();
       
       var filteredRisks = new Array();
       
       this.risks.forEach(function(risk){
          if (risk.manager1ID == managerID){
             filteredRisks.push(risk);
          } 
       });
       
       this.svgMatrix(filteredRisks);
       
    },
    riskSelect:function(){
       
       $$('comboRiskOwnerMat').clearValue();
       $$('comboRiskManagerMat').clearValue();
       
       this.svgMatrix(this.risks);
       var riskCode = "#"+$$('comboFindRiskMat').getValue();

       
       var g = d3.select(riskCode);
       g.node().parentNode.appendChild( g.node());

       
       g.select("circle.inner").transition().duration(500)
       .styleTween("fill", function() { return d3.interpolate("white", "black"); })
       .attr("r","40")
       .transition().duration(500)
       .styleTween("fill", function() { return d3.interpolate("black", "white"); })
       .attr("r","25")
       .transition().duration(500)
       .styleTween("fill", function() { return d3.interpolate("white", "black"); })
       .attr("r","40")
       .transition().duration(500)
       .styleTween("fill", function() { return d3.interpolate("black", "white"); })
       .attr("r","25")
       .transition().duration(500)
       .styleTween("fill", function() { return d3.interpolate("white", "black"); })
       .attr("r","40")
       .transition().duration(500)
       .styleTween("fill", function() { return d3.interpolate("black", "white"); })
       .attr("r","25");

       $$('qrm-RelMatSelectorDetail').update("");
       $$('comboFindRiskMat').clearValue();
       
    },
    okToSwitchProject: function (newProjectID) {
        if (!this.matrixDirty) {
            return true;
        } else {
           this.dirtySwitch(null, null, newProjectID);
            return false;
        }
    },
    okToSwitchTab: function (tabPanel, newCard) {
        if (!this.matrixDirty) {
            return true;
        } else {
           this.dirtySwitch(tabPanel, newCard);
            return false;
        }
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
                QRM.app.getRelMatrixController().matrixDirty = false;
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
                QRM.app.getRelMatrixController().saveChanges(true, tabPanel, newCard, newProjectID);
                 return;
             }            

          },
         icon: Ext.Msg.QUESTION
      });       
    },
    resizePanel: function () {
       this.svgMatrix(this.risks);
    },
    clearFilters:function(){
       $$('comboRiskOwnerMat').clearValue();
       $$('comboRiskManagerMat').clearValue();
       $$('comboFindRiskMat').clearValue();
    },
    switchTab: function () {
       this.clearFilters();
       this.getRisksAndPlace();
    },
    switchProject: function (project, desc) {
       this.clearFilters();
       this.getRisksAndPlace();
       return;
    },
    getRisksAndPlace: function () {
       
       var loadingbox = Ext.MessageBox.wait('Please wait while data is retrieved', 'Retrieving Data', {
            interval: 100,
            animate: true,
            text: 'Loading..'
        });

        Ext.Ajax.request({
            url: "./getRiskLiteRPC",
            disableCaching: true,
            params: {
                "ULTRALITE": true,
                    "DESCENDANTS": $$('cbDescendants').value,
                    "PROJECTID": QRM.global.projectID,
                    "NOCACHE": Math.random()
            },
            success: function (response) {
               QRM.app.getRelMatrixController().matrixDirty = false;
               var risks = Ext.JSON.decode(response.responseText);
               risks.forEach(function(risk){
                  risk.untreatedClean = true;
                  risk.treatedClean = true;
                  risk.dirty = false;
               });

               QRM.app.getRelMatrixController().risks = risks;
               QRM.app.getRelMatrixController().svgMatrix(risks);

                loadingbox.hide();
                
                relMatRiskStore.loadData(QRM.app.getRelMatrixController().risks);       
                $$('comboFindRiskMat').bindStore(relMatRiskStore);

            }
        });
    },
    
    pan : function (dx, dy) {    
 
       this.transMatrix[4] += dx;
       this.transMatrix[5] += dy;
       
       var newMatrix = "matrix(" +  this.transMatrix.join(' ') + ")";
       
       d3.select("g.relMatrixGroupHolder").attr("transform", newMatrix);
    },
    zoom:function(scale) {
       
        for (var i=0; i<this.transMatrix.length; i++) {
          this.transMatrix[i] *= scale;
       }
      
       var newMatrix = "matrix(" +  this.transMatrix.join(' ') + ")";
       d3.select("g.relMatrixGroupHolder").attr("transform", newMatrix);
    },
    
    resetPZ:function(){
       this.transMatrix[0] = 1;
       this.transMatrix[1] = 0;
       this.transMatrix[2] = 0;
       this.transMatrix[3] = 1;
       this.transMatrix[4] = 45;
       this.transMatrix[5] = 45;
       
       var newMatrix = "matrix(" +  this.transMatrix.join(' ') + ")";
       d3.select("g.relMatrixGroupHolder").attr("transform", newMatrix);

    },

    
    svgMatrix: function(risks){
       
       var tolString = QRM.global.project.matrix.tolString;
       var maxImpact = QRM.global.project.matrix.maxImpact;
       var maxProb = QRM.global.project.matrix.maxProb;
       var divWidth = $$('qrm-RelMatrixOuterPanel').getWidth();
       var divHeight =  $$('qrm-RelMatrixOuterPanel').getHeight();
       var margin = { top: 45, right: 45, bottom: 45, left: 45 };
       var width = divWidth - margin.left - margin.right;
       var height = divHeight - margin.top - margin.bottom;

       var data = new Array();

       for (var prob = maxProb;prob > 0 ; prob -- ) {
          for (var impact=1;impact <= maxImpact; impact++ ){
             var index = (prob - 1) * maxImpact + impact - 1;
             var tol = tolString.substring(index, index + 1);
             data.push({"impact":impact, "prob": prob, "tol":tol} );
          }
       }
       
       var status =  $$('qrm-RelMatStateID').items.get(0).getGroupValue();
       var gridSizeX = Math.floor(width / maxImpact);
       var gridSizeY = Math.floor(height / maxProb);

       QRM.global.relMatrixGridSizeX = gridSizeX;
       QRM.global.relMatrixGridSizeY = gridSizeY;
       
       //Create the matrix

       d3.select("#relMatrixSVGDiv svg").remove();
       
       var topSVG = d3.select("#relMatrixSVGDiv").append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom);

       //Need to embed the style into the SVG element so it can be interpreted by the PNGTranscoder on the server
       topSVG.append("defs")
       .append("style")
       .attr("type", "text/css")
       .text(
                "rect.tolNoHover5 {fill: #ff0000;stroke: #E6E6E6;stroke-width: 2px; }" +
                "rect.tolNoHover4 {fill: #ffa500;stroke: #E6E6E6;stroke-width: 2px; }" +
                "rect.tolNoHover3 {fill: #ffff00;stroke: #E6E6E6;stroke-width: 2px; }" +
                "rect.tolNoHover2 {fill: #00ff00;stroke: #E6E6E6;stroke-width: 2px; }" +
                "rect.tolNoHover1 {fill: #00ffff; stroke: #E6E6E6; stroke-width: 2px; }" +
                "g.state circle {stroke  : gray; cursor  : pointer;}"+
                "g.state circle.inner { fill : white;}"+
                "g.state circle.outer { display : none; stroke-dasharray: 4px;  stroke-opacity  : 0.5;}"+
                "g.state text.untreated { fill:red; font: 12px sans-serif; font-weight : bold; pointer-events : none; }"+
                "g.state text.treated { fill:blue; font: 12px sans-serif; font-weight : bold; pointer-events : none; }");
      
       var svg = topSVG
       .append("g")
       .attr("class", "relMatrixGroupHolder")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ") ");
       
       var heatMap = svg.selectAll()
       .data(data)
       .enter().append("g")
       .attr("class", "tolCellNoHover");
       
       heatMap.append("rect")
       .attr("x", function(d) { return (d.impact - 1) * gridSizeX; })
       .attr("y", function(d) { return (maxProb - d.prob) * gridSizeY; })
       .attr("rx", 2)
       .attr("ry", 2)
       .attr("class", function(d){ return "tolNoHover"+d.tol; })
       .attr("width", gridSizeX)
       .attr("height", gridSizeY);
       
     
       svg.append("text")
       .attr("text-anchor", "middle")
       .style("font-size", "20px")
       .style("font-weight", "normal")
       .attr("transform", "translate(" + [ width/2, height+20 ] + ")")
       .text("Impact");

       var title =  QRM.global.project.projectTitle;
       if($$('cbDescendants').value){
          title = title+" and Sub Projects";
       }
       
       var state = "Current State";
       var status =  $$('qrm-RelMatStateID').items.get(0).getGroupValue();
       switch (status){
             case 0:
                state = "Current State";
                break;
             case 1:
                state = "Un Treated State";
                break;
             case 2:
                state = "Treated State";
                break;
                
        }

       topSVG.append("text")
       .attr("text-anchor", "middle")
       .style("font-size", "20px")
       .style("font-weight", "normal")
       .attr("transform", "translate(" + [ width/2, 20 ] + ")")
       .text( title);
       
       topSVG.append("text")
       .attr("text-anchor", "middle")
       .attr("id", "relMatrixSubHeading")
       .style("font-size", "15px")
       .style("font-weight", "normal")
       .attr("transform", "translate(" + [ width/2, 38 ] + ")")
       .text( state);
       
       svg.append("text")
       .attr("text-anchor", "middle")
       .style("font-size", "20px")
       .style("font-weight", "normal")
       .attr("transform", "translate(" + [ -10, height/2 ] + ") rotate(-90)")
       .text("Probability");
       
       //Configure the drag behaviour
       
       var drag = d3.behavior.drag()
       .on("dragstart", function(){
          var e = d3.event.sourceEvent;
          if( e.ctrlKey) return;
          d3.event.sourceEvent.stopPropagation();
       })
       .on("drag", function(){
          var e = d3.event.sourceEvent;
          if( e.ctrlKey) return;
          d3.select(this).attr("transform", function( d, i) {
             if( d3.event.ctrlKey) return;
             g = this.parentNode,
             isSelected = d3.select( g).classed( "selected");


             d.x += d3.event.dx;
             d.y += d3.event.dy;
             if (d.x < 0){
                d.x = 0;
             }
             if (d.y < 0){
                d.y = 0;
             }
             
             if (d.x > width){
                d.x = width;
             }
             
             if (d.y > height){
                d.y = height;
             }
             return "translate(" + [ d.x,d.y ] + ")";
         });
       })
       .on("dragend", function(d){
          var e = d3.event.sourceEvent;
          if( e.ctrlKey) return;
          d3.event.sourceEvent.stopPropagation();
          QRM.app.getRelMatrixController().matrixDirty = true;
          d.dirty = true;
          var impact = 1+(d.x / QRM.global.relMatrixGridSizeX);
          var prob = (QRM.global.project.matrix.maxProb + 1) - (d.y / QRM.global.relMatrixGridSizeY);

          switch($$('qrm-RelMatStateID').items.get(0).getGroupValue()){
             case 0:
                if (d.treated){
                   d.treatedClean = false;
                   d.newTreatedImpact = impact;
                   d.newTreatedProb = prob;                   
                } else {
                   d.untreatedClean = false;
                   d.newUntreatedImpact = impact;
                   d.newUntreatedProb = prob;                   
                }
                break;
             case 1:
                d.untreatedClean = false;
                d.newUntreatedImpact = impact;
                d.newUntreatedProb = prob;
                break;
             case 2:
                d.treatedClean = false;
                d.newTreatedImpact = impact;
                d.newTreatedProb = prob;
          }
          
          d3.event.sourceEvent.stopPropagation();
       });
       
       
       //Create the items on the matrix

       var radius = 25;
       
     var holder = svg.append("g")
     .attr("class", "risk");
 
       var gRisks = holder.selectAll().data(risks);
       var gRisk = gRisks.enter().append( "g")
       .attr("id",function(d){return d.riskProjectCode;})
       .attr({
           "transform" : function( d) {
              var prob =  null;
              var impact = null;
              switch (status){
                 case 0:
                    prob = (d.treated)?d.treatedProb:d.inherentProb;
                    impact = (d.treated)?d.treatedImpact:d.inherentImpact;
                    break;
                 case 1:
                    prob = d.inherentProb;
                    impact = d.inherentImpact;
                    break;
                 case 2:
                    prob = d.treatedProb;
                    impact = d.treatedImpact;
                    break;
                    
              }
              
              var x = (impact - 1) * QRM.global.relMatrixGridSizeX;
              var y = (maxProb+1-prob) * QRM.global.relMatrixGridSizeY;

              d.x = x;
              d.y = y;
              //Prevent initial layout from overlapping items.
              QRM.app.getRelMatrixController().risks.forEach(function(risk){
                 if (Math.abs(risk.x - d.x) < 10 && Math.abs(risk.y - d.y) < 10 && risk.riskProjectCode != d.riskProjectCode){
                    d.x += 5;
                    d.y += 5;
                 }
              });
               return "translate("+ [d.x,d.y] + ")";
           },
           'class'     : 'state' 
       });
       
       gRisk.call(drag);
       
       gRisk.append( "circle").attr({ r : radius + 4, class   : 'outer'});
       
       gRisk.append( "circle").attr({ r : radius, class : 'inner' })
       .on( "click", function( d, i) {
           var e = d3.event,
               g = this.parentNode,
               isSelected = d3.select( g).classed( "selected");

           if( !e.ctrlKey) {
               d3.selectAll( 'g.selected').classed( "selected", false);
           }
           
           d3.select( g).classed( "selected", !isSelected);
           g.parentNode.appendChild( g);
       })
       .on("mouseover", function(d){
          var g = this.parentNode;
          var isSelected = d3.select( g).classed( "selected");
          d3.selectAll( 'g.selected').classed( "selected", false);              
          d3.select( g).classed( "selected", !isSelected);
          // reappend dragged element as last so that its stays on top 
          g.parentNode.appendChild( g);

           var html = "<div style='valign:top'><br><hr><strong>" + d.riskProjectCode + " - " + d.title + "<br><br>Description:<br><br></strong>" + d.description.substring(0, 500) + "<hr></div>";
           $$('qrm-RelMatSelectorDetail').update(html);
           d3.select(this).style( "fill", "aliceblue");
       })
       .on("mouseout", function(d) { 
         d3.select(this).style("fill", "white");
         d3.selectAll( 'g.selected').classed( "selected", false);              
         $$('qrm-RelMatSelectorDetail').update("");
       })
       .on("click", function(d){ 
          var e = d3.event;
          if( !e.ctrlKey) return;
          if (d3.event.defaultPrevented) return; 
          if (QRM.app.getRelMatrixController().matrixDirty){
             msg("Open Risk", "Please save or cancel existing changes before opening the risk");
          } else {
             QRM.app.getRelMatrixController().listenForEditorChanges = true;
             getRiskCodeAndDisplayInt(d.riskProjectCode); 
          }
        });
       
       gRisk.append( "text").attr({'text-anchor' : 'middle', y : 4 })
       .attr("class", function (d){ if(d.treated) {return "treated";} else return "untreated";})
       .text( function( d) { return d.riskProjectCode; });

       gRisk.append( "title").text( function( d) {return d.riskProjectCode; }) ;
    }
});