/**
 * 
 */
Ext.define('QRM.controller.MainTabs', {
   extend: 'Ext.app.Controller',
   views: [ 'MainTabs' ],
   init: function() {
      
      // Get a map of all the controllers linked to their tab panel id
      this.controllerMap = new Map();
      this.controllerMap.put("tabExplorer", QRM.app.getExplorerController());
      this.controllerMap.put("tabCalender", QRM.app.getCalenderController());
      this.controllerMap.put("tabAnalysis", QRM.app.getAnalysisController());
      this.controllerMap.put("tabReport", QRM.app.getReportController());
      this.controllerMap.put("tabMatrix", QRM.app.getRelMatrixController());
      this.controllerMap.put("tabIncident", QRM.app.getIncidentController());
      this.controllerMap.put("tabOverview", QRM.app.getOverviewController());
      this.controllerMap.put("tabRanking", QRM.app.getRankingController());
      this.controllerMap.put("tabSummaryRisks", QRM.app.getSummaryRisksController());
      this.controllerMap.put("tabReviews", QRM.app.getReviewController());
      
      this.control({'qrm-maintabs' :{
         tabchange : this.mainTabChange,
         beforetabchange : this.beforeMainTabChange
      }});

   },

   viewportResize:function(){
      var activeTab = $$('qrm-mainTabsID').getActiveTab();
      var activeController = this.controllerMap.get(activeTab.id);
      activeController.resizePanel();
    },
   mainTabChange:function(tabPanel, newCard, oldCard){
      var activeController = this.controllerMap.get(newCard.id);
      activeController.switchTab();      
  },

   beforeMainTabChange:function(tabPanel, newCard, oldCard){
      // Check with current tab that it is OK to switch
      
      var activeTab = $$('qrm-mainTabsID').getActiveTab();
      var activeController = this.controllerMap.get(activeTab.id);
      if (!activeController.okToSwitchTab(tabPanel, newCard)){         
         return false;
      } else {
         return true;
      }
   },
   resetCurrentProject:function(){
     this.switchProject(QRM.global.projectID, $$('cbDescendants').value); 
   },
   
   switchProject : function(projectID, desc){

       /*
       * Manages new project selection. Called by the Navigator Controller as a result of a node selection of Descendant Click 
       */
      
      var activeTab = $$('qrm-mainTabsID').getActiveTab();
      var activeController = this.controllerMap.get(activeTab.id);

      
      // Check ok with current tab to switch.
      
      if (!activeController.okToSwitchProject(projectID)){
         // Re highlight the original project in the navigator
         
         var store = $$("qrmNavigatorID").getStore();
         var record = store.findRecordByProjectID(QRM.global.projectID);
         $$("qrmNavigatorID").getSelectionModel().select(record);

         return;
      }
      
      this.getProject(projectID);
      
   },
   getProject:function(projectID){
      
      var activeTab = $$('qrm-mainTabsID').getActiveTab();
      var activeController = this.controllerMap.get(activeTab.id);

       // get the new project
      
      QRM.global.projectID = projectID;
      Ext.Ajax.request({
         url: "./getRiskProject",
         params: {
            "PROJECTID": QRM.global.projectID,
            "DESCENDANTS": $$('cbDescendants').value,
            "ROLLED": (QRM.global.viewState == "Rolled") ? true : false

         },
         success: function(response){
            try {
               QRM.global.project = Ext.JSON.decode(response.responseText);
               
               // pass switching to the responsible controller
               activeController.switchProject(QRM.global.project,$$('cbDescendants').value);
               
            } catch (e) {
               alert(e.message);
            }         
         }

      });
   }
});