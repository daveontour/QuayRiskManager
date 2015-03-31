/**
 * 
 */
Ext.define('QRM.controller.RiskEditor', {
   extend: 'Ext.app.Controller',
   views:['editor.RiskEditor', 
          'editor.DataTab', 
          'editor.MitigationTab',
          'editor.ResponseTab',
          'editor.StakeholderTab',
          'editor.StatusTab',
          'editor.ProbTab',
          'editor.ConsequenceTab',
          'editor.ControlTab',
          'editor.AttachmentTab',
          'editor.AuditTab',
          'editor.ObjectiveTab',
          'editor.MitigationUpdates',
          'editor.ManageConsequences',
          'editor.ConsequenceWidget'
          ],
   stores:['AllStakeholders'          
           ],
   
  ignoreFormChange:false,
  suspendFormChangeEvents:true,
  riskEditorDirty : false,
  width:100,
  height:100,
  radius:25,
  
  init: function(){

     this.control({'#qrmID-RiskEditorPrimCat' :{select:this.primCatChange}});
     this.control({'qrmXType-riskEditor':{
        beforeclose:this.beforeEditorClose
     }});
 
     this.control({'qrmXType-riskEditor tabpanel' :{
        tabchange : this.tabChange,
        beforetabchange : this.beforeTabChange
     }});


     this.control({'#qrm-RiskEditorUseCalculatedProbID': {change: this.useCalcProbChange}});     
     this.control({'#qrm-RiskEditorProbFreqTypeTreatedID': {change: this.freqTypeChange}});     
     this.control({'#qrm-RiskEditorProbFreqTypeUnTreatedID': { change: this.freqTypeChange }});  
     this.control({'qrmXType-riskEditorProb numberfield': {change: this.probFieldChange}});  

     this.control({'#qrm-RiskEditorConsequencesContingencyPercentileID': {change: this.contingencyPercentileChange }}); 
     this.control({'#qrm-calcContincencyButtonID': {click: this.updateContingencyOnly}});
     this.control({'#qrmID-RiskEditorConsequenceTreatmentGroup': {change: this.contingencyStateSelectorChange}});  
     
     this.control({'#qrmID-RiskEditorCancelBtn1': {click: this.cancelChanges}});      
     this.control({'#qrmID-RiskEditorCancelBtn2': {click: this.cancelChanges}});      
     this.control({'#qrmID-RiskEditorCancelBtn3': {click: this.cancelChanges}});      
     this.control({'#qrmID-RiskEditorCancelBtn4': {click: this.cancelChanges}});      

     this.control({'#qrmID-RiskEditorSaveBtn1': {click: this.saveChanges}});      
     this.control({'#qrmID-RiskEditorSaveBtn2': {click: this.saveChanges}});      
     this.control({'#qrmID-RiskEditorSaveBtn3': {click: this.saveChanges}});      
     this.control({'#qrmID-RiskEditorSaveBtn4': {click: this.saveChanges}});   
   },
    
    // Special processing if required as each tab is selected
    tabChange:function(tabPanel, newCard, oldCard){
       if (newCard.id == 'editorProbTab'){
          
          //Create Matrix and layout the indicators. 
          
          var radius = 25;
          var tolString = QRM.global.project.matrix.tolString;
          var maxImpact = QRM.global.project.matrix.maxImpact;
          var maxProb = QRM.global.project.matrix.maxProb;
          var margin = { top: radius, right: radius, bottom: radius, left: radius };
          this.height = this.width = 500 - 2*this.radius;

          var data = new Array();

          for (var prob = maxProb;prob > 0 ; prob -- ) {
             for (var impact=1;impact <= maxImpact; impact++ ){
                var index = (prob - 1) * maxImpact + impact - 1;
                var tol = tolString.substring(index, index + 1);
                data.push({"impact":impact, "prob": prob, "tol":tol} );
             }
          }
          
          var gridSizeX = Math.floor(this.width / maxImpact);
          var gridSizeY = Math.floor(this.height / maxProb);
          
          this.gridSizeX = gridSizeX;
          this.gridSizeY = gridSizeY;

          
          //Create the matrix
          d3.selectAll("#riskEditorMatrixID svg").remove();
          
          var topSVG = d3.select("#riskEditorMatrixID").append("svg")
          .attr("width", this.width + margin.left + margin.right)
          .attr("height", this.height + margin.top + margin.bottom);

          //Need to embed the style into the SVG element so it can be interpreted by the PNGTranscoder on the server
          topSVG.append("defs")
          .append("style")
          .attr("type", "text/css")
          .text(
                   "rect.tolNoHover5 {fill: #ff0000;stroke: #E6E6E6;stroke-width: 2px; }" +
                   "rect.tolNoHover4 {fill: #ffa500;stroke: #E6E6E6;stroke-width: 2px; }" +
                   "rect.tolNoHover3 {fill: #ffff00;stroke: #E6E6E6;stroke-width: 2px; }" +
                   "rect.tolNoHover2 {fill: #00ff00;stroke: #E6E6E6;stroke-width: 2px; }" +
                   "rect.tolNoHover1 {fill: #00ffff; stroke: #E6E6E6; stroke-width: 2px; }"+
                   "g.riskEditorRiskUntreated text.untreated { fill:red; font: 12px sans-serif; font-weight : bold; pointer-events : none; }"+
                   "g.riskEditorRiskTreated text.treated { fill:blue; font: 12px sans-serif; font-weight : bold; pointer-events : none; }"

                   );
          
          var svg = topSVG
          .append("g")
          .attr("class", "riskEditorMatrixHolder")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ") ");
          
          var heatMap = svg.selectAll()
          .data(data)
          .enter().append("g")
          .attr("class", "tolCellNoHover");
          
          // This is the matrix itself
          heatMap.append("rect")
          .attr("x", function(d) { return (d.impact - 1) * gridSizeX; })
          .attr("y", function(d) { return (maxProb - d.prob) * gridSizeY; })
          .attr("rx", 2)
          .attr("ry", 2)
          .attr("class", function(d){ return "tolNoHover"+d.tol; })
          .attr("width", gridSizeX)
          .attr("height", gridSizeY);
          
          // Behavior of the indicators when they are dragged
          var drag = d3.behavior.drag()
          .on("dragstart", function(){ $$('qrm-RiskEditorUseCalculatedProbID').setValue(false);})
          .on("drag", function(){
             d3.select(this).attr("transform", function( d, i) {
                var node = d3.select(this);
                var treated = node.attr("treated") == "true";
                var width = QRM.app.getRiskEditorController().width;
                var height = QRM.app.getRiskEditorController().height;
                
                if (treated){
                   d.x1 += d3.event.dx;
                   d.y1 += d3.event.dy;
                   
                   if (d.x1 < 0){d.x1 = 0; }
                   if (d.y1 < 0){d.y1 = 0; }
                   if (d.x1 > width){d.x1 = width;}
                   if (d.y1 > height){d.y1 = height;}
                   
                   d.treatedImpact = 1+(d.x1 / QRM.app.getRiskEditorController().gridSizeX);
                   d.treatedProb = (QRM.global.project.matrix.maxProb + 1) - (d.y1 / QRM.app.getRiskEditorController().gridSizeX);
                   
                   var prob = ((d.treatedProb-1)/QRM.global.project.matrix.maxProb)*100;
                   $$('qrm-RiskEditorProbProbTreatedID').setValue(prob.toFixed(2)+"%");
                   $$('qrm-RiskEditorProbImpactTreatedID').setValue(Math.floor(d.treatedImpact));
                  
                   return "translate(" + [ d.x1,d.y1 ] + ")"; 
                   
                } else {
                   
                   d.x += d3.event.dx;
                   d.y += d3.event.dy;
                   
                   if (d.x < 0){d.x = 0; }
                   if (d.y < 0){d.y = 0; }
                   if (d.x > width){d.x = width;}
                   if (d.y > height){d.y = height;}

                   d.inherentImpact = 1+(d.x / QRM.app.getRiskEditorController().gridSizeX);
                   d.inherentProb = (QRM.global.project.matrix.maxProb + 1) - (d.y / QRM.app.getRiskEditorController().gridSizeX);
                   
                   var prob = ((d.inherentProb-1)/QRM.global.project.matrix.maxProb)*100;
                   $$('qrm-RiskEditorProbProbUnTreatedID').setValue(prob.toFixed(2)+"%");
                   $$('qrm-RiskEditorProbImpactUnTreatedID').setValue(Math.floor(d.inherentImpact));
                   
                   return "translate(" + [ d.x,d.y ] + ")";
                }
            });
          })
          .on("dragend", function(d){
 
             d.dirty = true;

             var node = d3.select(this);
             var treated = node.attr("treated") == "true";
             
             if (treated){
                d.treatedImpact = 1+(d.x1 / QRM.app.getRiskEditorController().gridSizeX);
                d.treatedProb = (QRM.global.project.matrix.maxProb + 1) - (d.y1 / QRM.app.getRiskEditorController().gridSizeX);
                var prob = ((d.treatedProb-1)/QRM.global.project.matrix.maxProb)*100;
                $$('qrm-RiskEditorProbProbTreatedID').setValue(prob.toFixed(2)+"%");

             } else {
                d.untreatedImpact = 1+(d.x / QRM.app.getRiskEditorController().gridSizeX);
                d.untreatedProb = (QRM.global.project.matrix.maxProb + 1) - (d.y / QRM.app.getRiskEditorController().gridSizeX);
                var prob = ((d.untreatedProb-1)/QRM.global.project.matrix.maxProb)*100;
                $$('qrm-RiskEditorProbProbUnTreatedID').setValue(prob.toFixed(2)+"%");
             }
             
          });
          
          //Initial position of the indicators
          var Xn = (this.risk.inherentImpact-1)/QRM.global.project.matrix.maxImpact;
          var Yn = (this.risk.inherentProb-1)/QRM.global.project.matrix.maxProb;
          
          this.risk.x = Xn*this.width;
          this.risk.y = (1-Yn)*this.height;
          
          var Xn1 = (this.risk.treatedImpact-1)/QRM.global.project.matrix.maxImpact;
          var Yn1 = (this.risk.treatedProb-1)/QRM.global.project.matrix.maxProb;
          
          this.risk.x1 = Xn1*this.width;
          this.risk.y1 = (1-Yn1)*this.height;

          var untreatedRisk = svg.selectAll().data([this.risk]).enter()
          .append("g")
          .style("cursor","move")
          .attr("transform", "translate("+[this.risk.x, this.risk.y]+")")
          .attr("treated", false)
          .attr("class", "riskEditorRiskUntreated")
          .call(drag);
          untreatedRisk.append("circle").style("fill","white").attr({r:this.radius});
          untreatedRisk.append("circle").style("fill","red").attr({r:this.radius-2});
          untreatedRisk.append("circle").style("fill","white").attr({r:this.radius-4});
          untreatedRisk.append( "text").attr({'text-anchor' : 'middle', y : 4 })
          .attr("class", "untreated")
          .text( function( d) { return d.riskProjectCode; });
          
          var treatedRisk = svg.selectAll().data([this.risk]).enter()
          .append("g")
          .style("cursor","move")
          .attr("transform", "translate("+[this.risk.x1, this.risk.y1]+")")
          .attr("treated", true)
          .attr("class", "riskEditorRiskTreated")
          .call(drag);
          treatedRisk.append("circle").style("fill","white").attr({r:this.radius});
          treatedRisk.append("circle").style("fill","blue").attr({r:this.radius-2});
          treatedRisk.append("circle").style("fill","white").attr({r:this.radius-4});
          treatedRisk.append( "text").attr({'text-anchor' : 'middle', y : 4 })
          .attr("class", "treated")
          .text( function( d) { return d.riskProjectCode; });
          
          
          // Set the form values
          var prob = ((this.risk.inherentProb-1)/QRM.global.project.matrix.maxProb)*100;
          $$('qrm-RiskEditorProbProbUnTreatedID').setValue(prob.toFixed(2)+"%");
          $$('qrm-RiskEditorProbImpactTreatedID').setValue(Math.floor(this.risk.inherentImpact));

          prob = ((this.risk.treatedProb-1)/QRM.global.project.matrix.maxProb)*100;
          $$('qrm-RiskEditorProbProbTreatedID').setValue(prob.toFixed(2)+"%");
          $$('qrm-RiskEditorProbImpactUnTreatedID').setValue(Math.floor(this.risk.inherentImpact));
          
          svg.append("text")
          .attr("text-anchor", "middle")
          .style("font-size", "20px")
          .style("font-weight", "normal")
          .attr("transform", "translate(" + [ -10, this.height/2 ] + ") rotate(-90)")
          .text("Probability");
          
          svg.append("text")
          .attr("text-anchor", "middle")
          .style("font-size", "20px")
          .style("font-weight", "normal")
          .attr("transform", "translate(" + [ this.width/2, this.height+20 ] + ")")
          .text("Impact");
                    
       }
       
       if (newCard.id == 'editorConsequencesTab'){         
          consequenceStore.loadData(QRM.global.currentRisk.probConsequenceNodes);
          if (QRM.global.currentRisk.useCalculatedContingency){
             $$('qrm-UsingSuppliedContingencyPanelID').hide();
          } else {
             $$('qrm-UsingSuppliedContingencyPanelID').show();             
          }
          this.calcContingency(true);
        }
       
       if (newCard.id == 'editorControlTab'){
          $$('qrmID-RiskEditorControlGrid').store.loadData(QRM.global.currentRisk.controls);
       }
       
       if (newCard.id == 'editorObjectivesTab'){
          $$('qrm-RiskEditorObjectiveTreeID').store.load();
       }  
       
       if (newCard.id =='editorAuditTab'){
          this.getRiskReviewData();
          this.getRiskAuditData();
       }
       
       // The attachment grid
       if (newCard.id =='editorAttachmentsTab'){
          attachmentStore.load({ params: {
             "RISKID": QRM.global.currentRisk.riskID,
             "PROJECTID":QRM.global.projectID
          }
          });
       }

   },
   
   updateContingencyOnly:function(){
      this.calcContingency(false);
   },
   calcContingency:function(updateGraph){
      var me  = this; 
      var value = $$('qrm-RiskEditorConsequencesContingencyPercentileID').value;
      Ext.Ajax.request({
         url: "./calcRiskContingency",
         params: {
          "RISKID": QRM.global.currentRisk.riskID,
          "PROJECTID": QRM.global.projectID,
          "DATA": JSON.stringify({"contingencyPercentile":value})
         },
         success: function(response){
            if(updateGraph){
               me.updateContingencyGraph();
            }
            var model = Ext.create('QRM.model.LiteRisk', Ext.JSON.decode(response.responseText));
            $$('qrm-RiskEditorConsequenceForm').loadRecord(model);
         }
      });      
   },
   
   updateContingencyGraph:function(){
      var  width = $$('qrm-RiskEditorConsequenceContingencyGraphID').getWidth();
      var  height = $$('qrm-RiskEditorConsequenceContingencyGraphID').getHeight();
      var url = "getContingencyGraph?HEIGHT=" + height + "&WIDTH=" + width + "&preMit=" + $$('qrmID-RiskEditorConsequenceTreatmentGroup').getValue().treatmentState + "&nocache=" + Math.random();
      $$('qrm-RiskEditorConsequenceContingencyGraphID').update("<img style=\"border-width:0px;border-style:none;\"  src=\"" + url + "\">");
   },
   contingencyStateSelectorChange:function(form, newVal, oldVal){
      this.updateContingencyGraph();
   },
   contingencyPercentileChange:function(){
      $$('qrm-RiskEditorConsequencesUContID').setValue("-");
      $$('qrm-RiskEditorConsequencesWUContID').setValue("-");
      $$('qrm-RiskEditorConsequencesContID').setValue("-");
      $$('qrm-RiskEditorConsequencesWContID').setValue("-");
   },

   // Special processing if needed before a tab is left
    beforeTabChange:function(tabPanel, newCard, oldCard){
//
    },
    
    //Prob Tab, probability set from the form
    updateProbFromForm:function(){

        if (this.suspendFormChangeEvents){
          return;
       }
       
       var T = 0, alpha = 0;
       var preType = $$('qrm-RiskEditorProbFreqTypeUnTreatedID').value;
       var postType = $$('qrm-RiskEditorProbFreqTypeTreatedID').value;       
       var days = (parseDate(this.risk.endExposure).getTime() - parseDate(this.risk.startExposure).getTime()) / (1000 * 60 * 60 * 24);

       
       switch (parseInt(preType, 10)) {
          case 1:
             T = 365;
             break;
          case 2:
             T = 30;
             break;
          case 3:
             T = parseFloat($$('qrm-RiskEditorProbDaysUnTreatedID').value);
             break;
          default:
             T = 0;
          }
       
       QRM.global.currentRisk.liketype = parseInt(preType, 10);
       QRM.global.currentRisk.liket = T;      
       QRM.global.currentRisk.likealpha = parseFloat($$('qrm-RiskEditorProbFreqOccUnTreatedID').value);

       alpha = QRM.global.currentRisk.likealpha;

       var alphat = alpha * (days / T);
       var prob = 1 - (Math.exp(-alphat) * ((Math.pow(alphat, 0) / fact(0))));

        
       if (!isNaN(prob)){
          $$('qrm-RiskEditorProbProbUnTreatedID').setValue((prob*100).toFixed(2)+"%");
          this.risk.inherentProb = prob*(QRM.global.project.matrix.maxProb + 1);
       } else {
          $$('qrm-RiskEditorProbProbUnTreatedID').setValue("-");  
          this.risk.inherentProb = (QRM.global.project.matrix.maxProb + 1);
       }

       switch (parseInt(postType, 10)) {
          case 1:
             T = 365;
             break;
          case 2:
             T = 30;
             break;
          case 3:
             T = parseFloat($$('qrm-RiskEditorProbDaysTreatedID').value);
             break;
          default:
             T = 0;          }


       QRM.global.currentRisk.likepostType = parseInt(postType, 10);
       QRM.global.currentRisk.likepostT = T;
       QRM.global.currentRisk.likepostAlpha = parseFloat($$('qrm-RiskEditorProbFreqOccTreatedID').value);

       alpha = QRM.global.currentRisk.likepostAlpha;

       alphat = alpha * (days / T);
       prob = 1 - (Math.exp(-alphat) * ((Math.pow(alphat, 0) / fact(0))));

      
       if (!isNaN(prob)){
          $$('qrm-RiskEditorProbProbTreatedID').setValue((prob*100).toFixed(2)+"%");
          this.risk.treatedProb = prob*(QRM.global.project.matrix.maxProb + 1);   
       } else {
          $$('qrm-RiskEditorProbProbTreatedID').setValue("-");  
          this.risk.treatedProb = (QRM.global.project.matrix.maxProb + 1);
       }
       
       var Xn = (this.risk.inherentImpact-1)/QRM.global.project.matrix.maxImpact;
       var Yn = (this.risk.inherentProb-1)/QRM.global.project.matrix.maxProb;
       

       this.risk.x = Xn*this.width;
       this.risk.y = (1-Yn)*this.height;
       
       var Xn1 = (this.risk.treatedImpact-1)/QRM.global.project.matrix.maxImpact;
       var Yn1 = (this.risk.treatedProb-1)/QRM.global.project.matrix.maxProb;
       
       this.risk.x1 = Xn1*this.width;
       this.risk.y1 = (1-Yn1)*this.height;
       
       d3.select("g.riskEditorRiskUntreated")
       .transition()
       .attr("transform", "translate("+[this.risk.x, this.risk.y]+")");

       d3.select("g.riskEditorRiskTreated")
       .transition()
       .attr("transform", "translate("+[this.risk.x1, this.risk.y1]+")");

    },
    probFieldChange:function(){
       this.updateProbFromForm();
    },
    useCalcProbChange:function(){
       var state = $$('qrm-RiskEditorUseCalculatedProbID').value;
      
      $$('qrm-RiskEditorProbFreqTypeTreatedID').setDisabled(!state);
      $$('qrm-RiskEditorProbFreqOccTreatedID').setDisabled(!state);
      $$('qrm-RiskEditorProbDaysTreatedID').setDisabled(!state || ( state && $$('qrm-RiskEditorProbFreqTypeTreatedID').value != 3));

      $$('qrm-RiskEditorProbFreqTypeUnTreatedID').setDisabled(!state);
      $$('qrm-RiskEditorProbFreqOccUnTreatedID').setDisabled(!state);
      $$('qrm-RiskEditorProbDaysUnTreatedID').setDisabled(!state ||( state && $$('qrm-RiskEditorProbFreqTypeUnTreatedID').value != 3));
      
      if (state){
         this.probFieldChange();
      }

    },
    
    freqTypeChange:function(){

       $$('qrm-RiskEditorProbDaysTreatedID').setDisabled( $$('qrm-RiskEditorProbFreqTypeTreatedID').value != 3);
       $$('qrm-RiskEditorProbDaysUnTreatedID').setDisabled( $$('qrm-RiskEditorProbFreqTypeUnTreatedID').value != 3);
       
       this.probFieldChange();
    },
   
   // Keep the Primary and Secondary Category combo boxes chained
    primCatChange:function(combo, records){
       
       var secCats = records[0].raw.sec;
       var control = $$('qrmID-RiskEditorSecCat');
       
       control.clearValue();
       control.bindStore();
       if (secCats != null){
          projectSecCategoryStore.loadData(secCats);       
       }
       control.bindStore(projectSecCategoryStore);

    },
    
    // Porcessing when the editor is closed
    beforeEditorClose:function(){
         if (this.riskEditorDirty ||
             $$('qrm-RiskEditorDataForm1').isDirty() || 
             $$('qrm-RiskEditorDataForm2').isDirty() ||
             $$('qrm-RiskEditorProbTabFormID').isDirty() ||
             $$('qrm-RiskEditorMitigationForm1').isDirty()){
             msg("Close Risk Editor", "You have unsaved changes. Please save or cancel changes");
          return false;
       }
              
      //Update the Risk Explorer
      QRM.app.getExplorerController().populateGrid(QRM.global.projectID, $$('cbDescendants').value);
      QRM.global.riskID = 0;
    },
     
    cancelChanges:function(){
       
       var me = this;
       
       Ext.Ajax.request({
          url: "./getRisk",
          params: {
             "PROJECTID": QRM.global.projectID,
             "RISKID": QRM.global.currentRisk.riskID
          },
          success: function(response){
             console.log("Cancelled Changes, now resetting form");
             if (me.riskEditorDirty){
                //If its not dirty, no need to ignore call
                me.ignoreFormChange  = true;
             }
             me.setRisk(Ext.JSON.decode(response.responseText));
         }

       });
    },
    
    saveChanges:function(){
       
 //Get the values from the different forms into a single object
       
       riskEditor.fireEvent("riskChanges");
        
       var values = merge_options($$('qrm-RiskEditorDataForm1').getValues(), $$('qrm-RiskEditorDataForm2').getValues());
       values = merge_options(values,$$('qrm-RiskEditorProbTabFormID').getValues());
       values = merge_options(values,$$('qrm-RiskEditorMitigationForm1').getValues());
       values.objectives = QRM.global.currentRisk.objectivesImpacted;
       values.riskID = QRM.global.currentRisk.riskID;
       values.projectID = QRM.global.projectID;
       values.Ext = true;
       
// Checkboxes only return 'on' so fill out the rest       
       var checkFields = [
       "impCost","impEnvironment","impReputation", "impSafety","impSpec","impTime",
       "summaryRisk","treated","useCalculatedContingency","useCalculatedProb",
       "treatmentAvoidance","treatmentReduction","treatmentRetention","treatmentTransfer"];
       
       Ext.Array.each(checkFields, function(f1){
          if (values[f1] == 'on'){
             values[f1] = true;
          } else {
             values[f1] = false;
          }
       });

// Disables fields dont return a value, so fill in the blanks if needed 
        Ext.Array.each(["liketype","likealpha","liket","likepostType","likepostAlpha","likepostT"], function(f1){
          if (!values[f1]){
             values[f1] = 0;
          }
       });
        
// Add in the impacted objectives (currentRisk is updates with changes)
        values.impactedObjectives = QRM.global.currentRisk.objectivesImpacted;
        
// Prob and Impact from the matrix items
        values.inherentProb = QRM.global.currentRisk.inherentProb;
        values.inherentImpact = QRM.global.currentRisk.inherentImpact;

        values.treatedProb = QRM.global.currentRisk.treatedProb;
        values.treatedImpact = QRM.global.currentRisk.treatedImpact;

        var me = this;
        
        Ext.Ajax.request({
          url: "./saveRisk",
          params: {
             "RISKID": QRM.global.currentRisk.riskID,
             "PROJECTID": QRM.global.projectID,
             "DATA": Ext.JSON.encode(values),
             "NOCACHE": Math.random()
          },
          success: function (response) {
             try {
                me.setRisk(Ext.JSON.decode(response.responseText));
              } catch (e) {
                alert(e.message);
             }
          }
       });

    },

   
    // Set up the editor with the requested risk
    setRisk: function(risk){
       
       
      // Default to the first tab
        $$('qrm-RiskEditorTabPanelID').setActiveTab(0);
        this.riskEditorDirty = false;
       
       this.risk = risk;
       QRM.global.currentRisk = this.risk;
       riskEditor.setTitle(risk.riskProjectCode+" - "+risk.title);
       
       //Check the primary category of the risk and set up the secondary combo box 
       //appropriately before the risk is loaded
       

       $$('qrmID-RiskEditorSecCat').clearValue();
       $$('qrmID-RiskEditorSecCat').bindStore();

       Ext.Array.each(projectCategoryStore.data.items, function(item){
          if (item.data.internalID == risk.primCatID && item.raw.sec != null){
             projectSecCategoryStore.loadData(item.raw.sec);
             return false;
          } else {
             projectSecCategoryStore.removeAll();
             return true;
          }         
       });
       $$('qrmID-RiskEditorSecCat').bindStore(projectSecCategoryStore);
       
       // Load the "Risk Data", "Prob Tab", "Mitigation" tab
       var model = Ext.create('QRM.model.LiteRisk', risk);
       $$('qrm-RiskEditorDataForm1').loadRecord(model);
       $$('qrm-RiskEditorDataForm2').loadRecord(model);
       $$('qrm-RiskEditorMitigationForm1').loadRecord(model);
       
       this.suspendFormChangeEvents = true;
       $$('qrm-RiskEditorProbTabFormID').loadRecord(model);
       this.suspendFormChangeEvents = false;
       
       // Get Response Plan by Filtering Mitigation Plan
       var resPlan = risk.mitigationPlan.filter(function(element){
          return (element.response == 1);
       });
       $$('qrmID-RiskEditorResponsePlanGrid').store.loadData(resPlan);

       // Get  Mitigation Plan
       var mitPlan = risk.mitigationPlan.filter(function(element){
          return (element.response == 0);
       });
       
       $$('qrmID-RiskEditorMitigationPlanGrid').store.loadData(mitPlan);
       $$('qrmID-RiskEditorMitigationPlanGrid2').store.loadData(mitPlan);

       allRiskStakeholdersStore.load({ params: {
          "RISKID": risk.riskID,
          "PROJECTID":QRM.global.projectID
       }
       });

       riskCommentStore.load({ params: {
          "RISKID": risk.riskID,
          "PROJECTID":QRM.global.projectID
       }
       });
            
      
     },
     getRiskReviewData:function() {

        Ext.Ajax.request({
           url: "./getRiskReviews",
           params: {
              "RISKID": QRM.global.currentRisk.riskID,
              "PROJECTID": QRM.global.projectID
           },
           success: function (response) {
              $$('qrmID-RiskEditorReviewGrid').store.loadData(Ext.JSON.decode(response.responseText));
           }
        });
     },
     getRiskAuditData:function () {

        // All the audit point information is stored in the comments fo the risk,
        // even if the user does not record an actual comment for the audit.
        Ext.Ajax.request({
           url: "./getRiskComments",
           evalResult: false,
           params: {
              "RISKID": QRM.global.currentRisk.riskID,
              "PROJECTID": QRM.global.projectID
           },
           success: function (response) {
              var comments = Ext.JSON.decode(response.responseText);
              var idRev=null;
              var evalRev=null;
              var mitRev=null;
              var idApp=null;
              var evalApp=null;
              var mitApp = null;           

              Ext.Array.each(comments, function(item){
                 if(item.identification && item.review){
                    idRev = item;
                    return false;
                 }
              });
              Ext.Array.each(comments, function(item){
                 if(item.evaluation && item.review){
                    evalRev = item;
                    return false;
                 }
              });
              Ext.Array.each(comments, function(item){
                 if(item.mitigation && item.review){
                    mitRev = item;
                    return false;
                 }
              });
              Ext.Array.each(comments, function(item){
                 if(item.identification && item.approval){
                    idApp = item;
                    return false;
                 }
              });
              Ext.Array.each(comments, function(item){
                 if(item.evaluation && item.approval){
                    evalApp = item;
                    return false;
                 }
              });  
              Ext.Array.each(comments, function(item){
                 if(item.mitigation && item.approval){
                    mitApp = item;
                    return false;
                 }
              });

              var arr = new Array();

              if (typeof (idRev) == "undefined" || idRev == null) {
                 idRev = new Object();
                 idRev.person = "-";
                 idRev.comment = "Not Yet Entered";
              }
              idRev.step = "Identification Review", arr.push(idRev);

              if (typeof (idApp) == "undefined" || idApp == null) {
                 idApp = new Object();
                 idApp.person = "-";
                 idApp.comment = "Not Yet Entered";
              }
              idApp.step = "Identification Approval", arr.push(idApp);

              if (typeof (evalRev) == "undefined" || evalRev == null) {
                 evalRev = new Object();
                 evalRev.person = "-";
                 evalRev.comment = "Not Yet Entered";
              }
              evalRev.step = "Evaluation Review", arr.push(evalRev);

              if (typeof (evalApp) == "undefined" || evalApp == null) {
                 evalApp = new Object();
                 evalApp.person = "-";
                 evalApp.comment = "Not Yet Entered";
              }
              evalApp.step = "Evaluation Approval", arr.push(evalApp);

              if (typeof (mitRev) == "undefined" || mitRev == null) {
                 mitRev = new Object();
                 mitRev.person = "-";
                 mitRev.comment = "Not Yet Entered";
              }
              mitRev.step = "Mitigation Review", arr.push(mitRev);

              if (typeof (mitApp) == "undefined" || mitApp == null) {
                 mitApp = new Object();
                 mitApp.person = "-";
                 mitApp.comment = "Not Yet Entered";
              }
              mitApp.step = "Mitigation Approval", arr.push(mitApp);

              $$('qrmID-RiskEditorAuditGrid').store.loadData(arr);
           }
        });
     }
});