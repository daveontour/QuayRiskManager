/**
 * 
 */
Ext.define('QRM.controller.Incident', {
   extend: 'Ext.app.Controller',
   views: ['incident.IncidentFilterPanel', 
           'incident.IncidentExplorerGrid', 
           'incidenteditor.IncidentEditor',
           'incidenteditor.AttachmentTab',
           'incidenteditor.ObjectiveTab'],
   stores:['Incident'],
   suspendFilterPanelListener : false,
   issueWindow:null,
   init:function(){
      this.control(
            {'qrm-incidentfilterpanel checkboxfield': {
               change: this.filterPanelChanged
            }
            }); 
      this.control(
            {'#txtIncidentRiskCode' :{
               keypress:this.handleRiskCodeKeyPress
            }
            });
      this.control(
            {'#txtIncidentIssueCode' :{
               keypress:this.handleIssueIncidentCodeKeyPress
            }
            });
      this.control({
         'qrm-incidentexplorer-grid': {
             itemdblclick: this.openIssue
         }
     });
   },
   openIssue:function(){
      if (this.issueWindow == null) {
         this.issueWindow = Ext.create('QRM.view.incidenteditor.IncidentEditor');
     }
      this.issueWindow.show();
      
   },
   okToSwitchProject: function(){
      return true;
   },
   okToSwitchTab: function(){
      return true;
   },
   switchTab: function(){
      this.resetFilterPanel();
      this.populateGrid(QRM.global.project, $$('cbDescendants').value);
   },
   resizePanel:function(){
      // 
   },
   switchProject : function(project, desc){
      this.resetFilterPanel();
      this.populateGrid(QRM.global.project, $$('cbDescendants').value);
   },
   handleRiskCodeKeyPress:function(field,e){
      this.resetFilterPanelLite();
      $$('txtIncidentIssueCode').setValue("");
      if ( e.getKey() == Ext.EventObject.RETURN ){
         this.handleRiskCodeSearch();
      }
      if ($$('txtIncidentRiskCode').value == ''){
         this.resetFilterPanel();
      }
   },
   handleRiskCodeSearch: function(){
      Ext.data.StoreManager.get('Incident').load({ params: {
         "DESCENDANTS": $$('cbDescendants').value,
         "RISKID": $$('txtIncidentRiskCode').value,
         "PROCESSFILTER": true,
         "NOCACHE": Math.random()
      }
      });
   },
   handleIssueIncidentCodeKeyPress:function(field,e){
      this.resetFilterPanelLite();
      $$('txtIncidentRiskCode').setValue("");
      if ( e.getKey() == Ext.EventObject.RETURN ){
         this.handleIssueIncidentCodeSearch();
      }
      if ($$('txtIncidentIssueCode').value == ''){
         this.resetFilterPanel();
      }
   },
   handleIssueIncidentCodeSearch: function(){
      
      // See if the incident exists
      Ext.Ajax.request({
         url: "./findIncidentByIncident",
         params: {
            "INCIDENTID": $$('txtIncidentIssueCode').value,
            "NOCACHE": Math.random()
         },
         success: function (response) {
            var foundIncident = Ext.JSON.decode(response.responseText);
            try {

               if (!foundIncident.projectID) {
                  Ext.Msg.show({
                     title: 'Incident/Issue Search',
                     msg: 'No Incidents or Issues were found',
                     width: 300,
                     buttons: Ext.Msg.OK,
                     icon: Ext.Msg.INFO
                 });
                  $$('txtIncidentIssueCode').setValue("");
                  return;
               } else {
                  // May not be in the existing project, so switch projects
                  QRM.global.projectID = foundIncident.projectID;
                  Ext.Ajax.request({
                     url: "./getRiskProject",
                     params: {
                        "PROJECTID": QRM.global.projectID,
                        "DESCENDANTS": $$('cbDescendants').value,
                        "ROLLED":  false
                     },
                     success: function(response2){
                        try {
                           var store = $$("qrmNavigatorID").getStore();
                           var record = store.findRecordByProjectID(QRM.global.projectID);
                           $$("qrmNavigatorID").getSelectionModel().select(record);
                           
                           
                           QRM.global.project = Ext.JSON.decode(response2.responseText);

                           // Load the grid with the incident
                           Ext.data.StoreManager.get('Incident').load({ params: {
                              "DESCENDANTS": $$('cbDescendants').value,
                              "PROJECTID": QRM.global.projectID,
                              "PROCESSFILTER": true,
                              "INCIDENTID": foundIncident.incidentID,
                              "NOCACHE": Math.random()
                           }
                           });
                        
                        } catch (e) {
                           alert(e.message);
                        }         
                     }

                  });
               }
            } catch (e) {
               Ext.Msg.show({
                  title: 'Incident/Issue Search',
                  msg: 'No Incidents or Issues were found',
                  width: 300,
                  buttons: Ext.Msg.OK,
                  icon: Ext.Msg.INFO
              });
               $$('txtIncidentIssueCode').setValue("");
               return;
            }
         }
      });

   },
   filterPanelChanged:function(){
      if (this.suspendFilterPanelListener){
         return;
      }
      $$('txtIncidentRiskCode').setValue("");
      $$('txtIncidentIssueCode').setValue("");
      this.populateGrid(QRM.global.projectID, $$('cbDescendants').value);     
     
   },
   resetFilterPanel:function(){
      this.suspendFilterPanelListener = true;
      
      $$('cbIncidentExtreme').setValue(true);
      $$('cbIncidentHigh').setValue(true);
      $$('cbIncidentSignificant').setValue(true);
      $$('cbIncidentModerate').setValue(true);
      $$('cbIncidentLow').setValue(true);
      $$('cbIncidentActive').setValue(true);
      $$('cbIncidentClosed').setValue(true);
      $$('cbIncidentReputation').setValue(true);
      $$('cbIncidentSafety').setValue(true);
      $$('cbIncidentSpecification').setValue(true);
      $$('cbIncidentSchedule').setValue(true);
      $$('cbIncidentCost').setValue(true);

      $$('txtIncidentRiskCode').setValue("");
      $$('txtIncidentIssueCode').setValue("");

      this.suspendFilterPanelListener = false;
      
      this.populateGrid(QRM.global.projectID, $$('cbDescendants').value);
   },
   resetFilterPanelLite:function(){
      this.suspendFilterPanelListener = true;
      
      $$('cbIncidentExtreme').setValue(true);
      $$('cbIncidentHigh').setValue(true);
      $$('cbIncidentSignificant').setValue(true);
      $$('cbIncidentModerate').setValue(true);
      $$('cbIncidentLow').setValue(true);
      $$('cbIncidentActive').setValue(true);
      $$('cbIncidentClosed').setValue(true);
      $$('cbIncidentReputation').setValue(true);
      $$('cbIncidentSafety').setValue(true);
      $$('cbIncidentSpecification').setValue(true);
      $$('cbIncidentSchedule').setValue(true);
      $$('cbIncidentCost').setValue(true);


      this.suspendFilterPanelListener = false;
      
   },
   populateGrid: function(projectID, desc){

      Ext.data.StoreManager.get('Incident').load(
         {params:{
         
            "DESCENDANTS": desc,
            "PROJECTID": projectID,
            "PROCESSFILTER": true,
            "TOLEX": $$('cbIncidentExtreme').value,
            "TOLHIGH": $$('cbIncidentHigh').value,
            "TOLSIG": $$('cbIncidentSignificant').value,
            "TOLMOD": $$('cbIncidentModerate').value,
            "TOLLOW": $$('cbIncidentLow').value,
            "STATACTIVE": $$('cbIncidentActive').value,
            "STATCLOSED": $$('cbIncidentClosed').value,
            "STATIMPREPUTATION": $$('cbIncidentReputation').value,
            "STATIMPSAFETY": $$('cbIncidentSafety').value,
            "STATIMPSPEC": $$('cbIncidentSpecification').value,
            "STATIMPTIME": $$('cbIncidentSchedule').value,
            "STATIMPCOST": $$('cbIncidentCost').value,
            "STATIMPENVIRON": $$('cbIncidentEnviron').value,
            "NOCACHE": Math.random()

     }
     });
}
   });