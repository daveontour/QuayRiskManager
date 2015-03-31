Ext.define('QRM.controller.ConsequenceWidget', {
   extend: 'Ext.app.Controller',
   ignoreNumberFieldChangeEvent: false,
   init: function() {
      
      this.control({'qrmXType-ConsequenceWidget numberfield': {change: this.numberFieldChange}});
      this.control({'qrmXType-ConsequenceWidget combobox': {change: this.comboFieldChange}});
      this.control({'#qrmID-RiskEditorConsequenceGrid' :{itemdblclick:this.openConsequenceEditor}});
      this.control({'#qrm-SaveConsequcesBtnID' :{click:this.saveConsequence}});
      this.control({'#qrm-CancelConsequcesBtnID' :{click:this.cancelConsequence}});
      this.control({'#qrm-RiskEditorConsequenceTabNewConsequenceBtnID':{click:this.newConsequence}});
      this.control({'#qrm-RiskEditorConsequenceTabDeleteConsequenceBtnID':{click:this.deleteConsequence}});

   },
   
   openConsequenceEditor: function(me, record, item){
      
      quantTypeStore.loadData(QRM.global.quantTypes);
      
      if(consequenceEditor == null){
         consequenceEditor = Ext.create('QRM.view.editor.ManageConsequences', {
         title: 'Consequnce Editor'
     });
     }
      consequenceEditor.show();
      // Get the selected consequence
      var node = record.raw;
      this.ignoreNumberFieldChangeEvent = true;
      $$('qrm-MitConsequenceID').setQRMValues(node.riskConsequenceProb, node.costDistributionType,node.costDistributionParamsArray);
      $$('qrm-PostMitConsequenceID').setQRMValues(node.postRiskConsequenceProb, node.postCostDistributionType,node.postCostDistributionParamsArray);
      
      var form = $$('qrm-RiskEditorConsequenceEditorUpdateWindowTopFormID').getForm();      
      form.findField('description').setValue(node.description);
      form.findField('quantType').setValue(node.quantType);
      form.findField('internalID').setValue(node.internalID);
      this.ignoreNumberFieldChangeEvent = false;
   },
   
   newConsequence:function(){
 
      quantTypeStore.loadData(QRM.global.quantTypes);
      
      if(consequenceEditor == null){
         consequenceEditor = Ext.create('QRM.view.editor.ManageConsequences', {
         title: 'Consequnce Editor'
     });
     }
      consequenceEditor.show();
      
      this.ignoreNumberFieldChangeEvent = true;
      $$('qrm-MitConsequenceID').clearQRMForm();
      $$('qrm-PostMitConsequenceID').clearQRMForm();
      
      var form = $$('qrm-RiskEditorConsequenceEditorUpdateWindowTopFormID').getForm();      
      form.findField('description').setValue("Description of the Consequence");
      form.findField('internalID').setValue(0);
      this.ignoreNumberFieldChangeEvent = false;

   },
   deleteConsequence:function(){
      Ext.Msg.show({
         title: 'Delete Consequences',
         msg: '<center>Delete Selected Consequences?</center>',
         width: 400,
         icon: Ext.Msg.QUESTION,
         buttons: Ext.Msg.YESNO,
         fn: function (btn) {
            if (btn == "yes"){
               
               var ids = new Array();
               Ext.Array.each($$('qrmID-RiskEditorConsequenceGrid').getSelectionModel().getSelection(), function(item){
                  ids.push(item.raw.internalID);
               });
               
               Ext.Ajax.request({
                  url: "./deleteConsequences",
                  params: {
                     "RISKID": QRM.global.currentRisk.riskID,
                     "PROJECTID":QRM.global.projectID,
                     "EXT":true,
                     "ID":Ext.encode(ids)
                  },
                  success: function (response) {
                     msg("Delete Consequences", "Consequnces Deleted");
                     QRM.global.currentRisk.probConsequenceNodes = Ext.decode(response.responseText);
                     consequenceStore.loadData(QRM.global.currentRisk.probConsequenceNodes);
                  }, 
                  failure: function(){
                     msg ("Delete Consequnces", "Error Deleting Consequences");
                  }
               });    
            }
         }
     });
   },
   
   saveConsequence: function(){
      
      var data = new Object();

      var form = $$('qrm-RiskEditorConsequenceEditorUpdateWindowTopFormID').getForm(); 
      data.description = form.findField("description").getValue();
      data.internalID = form.findField("internalID").getValue();
      data.quantType = form.findField("quantType").getValue();

      data.preMitData1 = $$('qrm-MitConsequenceID').getForm().getValues();
//      data.preMitData2 = this.preMitPane.descreteGrid.getData();

      data.postMitData1 = $$('qrm-PostMitConsequenceID').getForm().getValues();
//      data.postMitData2 = this.postMitPane.descreteGrid.getData();
      
      Ext.Ajax.request({
         url: "./saveConsequences",
         params: {
            "DATA": JSON.stringify(data),
            "RISKID": QRM.global.currentRisk.riskID,
            "PROJECTID":QRM.global.projectID,
            "EXT":true
         },
         success: function (response) {
            msg("Save Consequnce", "Consequnce Saved");
            QRM.global.currentRisk.probConsequenceNodes = Ext.decode(response.responseText);
            consequenceStore.loadData(QRM.global.currentRisk.probConsequenceNodes);
            consequenceEditor.close();
         }, 
         failure: function(){
            msg ("Save Consequnce", "Error Saving Consequence");
         }
      });
   },
   cancelConsequence:function(){
      consequenceEditor.close();
   },
   numberFieldChange:function(field, newValue, oldValue){
      if(this.ignoreNumberFieldChangeEvent){
         return;
      } else if(field.name == 'probability'){
         return;
      }else {
         this.actOnChange(field.up('form'));
      }
   },
   comboFieldChange:function(field, newValue, oldValue){

      var formPanel = field.up('form');
      var form = formPanel.getForm();
      
      var meanF = form.findField('mean');
      var stdDevF = form.findField('stdDev');
      var minF = form.findField('min');
      var maxF = form.findField('max');
      var mostF = form.findField('most');
      var lowerF = form.findField('lower');
      var upperF = form.findField('upper');
      var simpleF = form.findField('simple');
      
      meanF.hide();
      stdDevF.hide();
      minF.hide();
      maxF.hide();
      mostF.hide();
      lowerF.hide();
      upperF.hide();
      simpleF.hide();

      
      if(newValue == 'au.com.quaysystems.qrm.util.probability.NormalDistribution'){
         meanF.show();
         stdDevF.show();
      }
      if(newValue == 'au.com.quaysystems.qrm.util.probability.TruncNormalDistribution'){
         meanF.show();
         stdDevF.show();
         lowerF.show();
         upperF.show();
      }
      if(newValue == 'au.com.quaysystems.qrm.util.probability.TriGenDistribution'){
         minF.show();
         maxF.show();
         mostF.show();
         lowerF.show();
         upperF.show();
      }
      if(newValue == 'au.com.quaysystems.qrm.util.probability.TriangularDistribution'){
         minF.show();
         mostF.show();
         maxF.show();
         
      }
      if(newValue == 'au.com.quaysystems.qrm.util.probability.SimpleDistribution'){
         simpleF.show();
      }
      if(newValue == 'au.com.quaysystems.qrm.util.probability.UniformDistribution'){
         upperF.show();
         lowerF.show();
      }
      
      this.actOnChange(formPanel);
   },
   
   actOnChange: function(formPanel) {
      var form = formPanel.getForm();
      var values = form.getFieldValues();
      
      var distType = values['distType'];
      var mean = parseFloat(values["mean"]);
      var stdDev = parseFloat(values["stdDev"]);
      var simple = parseFloat(values["simple"]);
      var min = parseFloat(values["min"]);
      var max = parseFloat(values["max"]);
      var most = parseFloat(values["most"]);
      var lower = parseFloat(values["lower"]);
      var upper = parseFloat(values["upper"]);

        
      if (distType == 'au.com.quaysystems.qrm.util.probability.NormalDistribution' && mean > 0 && stdDev > 0) {
         this.updateFormChart(formPanel);
      } else if ( distType == 'au.com.quaysystems.qrm.util.probability.SimpleDistribution' && simple > 0) {
         updateFormChart(formPanel);
      } else if (distType == 'au.com.quaysystems.qrm.util.probability.TriangularDistribution' && min > 0 && most > 0 && max > 0 && min < most && most < max) {
         this.updateFormChart(formPanel);
      } else if (distType == 'au.com.quaysystems.qrm.util.probability.TriGenDistribution' && (min < most) && (most < max) && (lower < upper) && upper < max && lower > min) {
         this.updateFormChart(formPanel);
      } else if ((distType == 'au.com.quaysystems.qrm.util.probability.TruncNormalDistribution')  && (lower > 0) && (upper > 0) && (lower < upper) && (mean > 0) && (stdDev > 0)) {
         this.updateFormChart(formPanel);
      } else if ( distType == 'au.com.quaysystems.qrm.util.probability.UniformDistribution' && lower >= 0 && upper > 0 && lower < upper) {
         this.updateFormChart(formPanel);
      } else {
     //    formPanel.parentElement.chart.setSrc("[SKIN]grid.gif");
      }
   },
   
   updateFormChart: function(formPanel) {
      
      var form = formPanel.getForm();
      var col = formPanel.preMit;
      var imgPanel = $$(formPanel.imgID);
      var values = Ext.encode(form.getValues());
      var encodedValues = replaceAll("\"", "%22", values);
      var url = "/getConsequenceImage?PREMIT=" + col + "&WIDTH=" + imgPanel.getWidth() + "&HEIGHT=" + imgPanel.getHeight() + "&VALUES=" + encodedValues;
      imgPanel.update("<img style=\"border-width:0px;border-style:none;\"  src=\"" + url + "\">");
   }
});