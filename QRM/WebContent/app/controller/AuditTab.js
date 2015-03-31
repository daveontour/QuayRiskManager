/**
 * 
 */

Ext.define('QRM.controller.AuditTab', {
    extend: 'Ext.app.Controller',
    currentItems: new Array(),
    matrixDirty: false,
    views: ['editor.ScheduleReviewWindow', 'editor.RegisterAuditWindow'],

    init: function () {

        this.control({'#qrmID-RiskEditorRegisterAuditBtn': {click: this.registerAudit}});
        this.control({'#qrmID-RiskEditorScheduleReviewBtn': {click: this.scheduleReview}});
        this.control({'#qrmID-RiskEditorAddNewAuditBtn': {click: this.addNewAudit}});
        this.control({'#qrmID-AddNewReviewForRiskBtn': {click: this.addNewReviewForRisk}});
        this.control({'#qrmID-NewReviewTypeSelector': {change: this.reviewTypeSelectorChanged}});

        this.control({'#qrmID-riskGridScheduleBtn': {click: this.scheduleReviewFromGrid}});

   
    },
    
    registerAudit:function(){
       if (registerAuditWindow == null){
          registerAuditWindow = Ext.create('QRM.view.editor.RegisterAuditWindow');
       }
       registerAuditWindow.show();
    },
    
    scheduleReview:function(){
       Ext.data.StoreManager.get('Review').load();
       if (scheduleReviewWindow == null){
          scheduleReviewWindow = Ext.create('QRM.view.editor.ScheduleReviewWindow');
       }
       scheduleReviewWindow.show();
       scheduleReviewWindow.fromGrid = false;
       
       $$('qrmID-NewReviewDate').setDisabled(false);
       $$('qrmID-NewReviewDescription').setDisabled(false);
       $$('qrmID-ExistingReviewSelector').setDisabled(true);
       $$('qrmID-NewReviewTypeSelector').setValue(0);
       
       $$('qrm-scheduleReviewFormID').getForm().reset();

       $$('qrmID-NewReviewRiskTable').store.loadData([QRM.global.currentRisk]);
       
       Ext.Ajax.request({
          url: "./getAllReviews",
          success: function(response){
                $$('qrmID-ExistingReviewSelector').store.loadData(Ext.decode(response.responseText));
          }
       });
    },
    scheduleReviewFromGrid:function(){
       
       if (!checkExplorerSelection()){
          msg("Schedule Review", "Please select the risks to be included in the review");
          return;
       }

       Ext.data.StoreManager.get('Review').load();
       if (scheduleReviewWindow == null){
          scheduleReviewWindow = Ext.create('QRM.view.editor.ScheduleReviewWindow');
       }
       scheduleReviewWindow.show();
       
       scheduleReviewWindow.fromGrid = true;
       
       $$('qrmID-NewReviewDate').setDisabled(false);
       $$('qrmID-NewReviewDescription').setDisabled(false);
       $$('qrmID-ExistingReviewSelector').setDisabled(true);
       $$('qrmID-NewReviewTypeSelector').setValue(0);
       
       $$('qrm-scheduleReviewFormID').getForm().reset();
       $$('qrmID-NewReviewRiskTable').store.loadData(getExplorerRisks());
       
       Ext.Ajax.request({
          url: "./getAllReviews",
          success: function(response){
                $$('qrmID-ExistingReviewSelector').store.loadData(Ext.decode(response.responseText));
          }
       });
    },    
    addNewAudit:function(){
       Ext.Ajax.request({
          url: "./registerAudit",
          params: {
             "RISKID": QRM.global.currentRisk.riskID,
             "DATA":JSON.stringify($$('qrm-registerAuditFormID').getForm().getValues()),
             "PROJECTID":QRM.global.projectID,
             "EXT":true
          },
          success: function(response){
             if (Ext.decode(response.responseText)){
                msg("Register Audit", "Audit Milestone Registered");
                QRM.app.getRiskEditorController().getRiskReviewData();
                QRM.app.getRiskEditorController().getRiskAuditData();
                
                //Update the Status Tab
                riskCommentStore.load({ params: {
                   "RISKID": QRM.global.currentRisk.riskID,
                   "PROJECTID":QRM.global.projectID
                }
                });
                
             } else {
                msg("Register Audit", "Failed to register Audit Milestone");            
             }
             registerAuditWindow.close();
          },
          failure: function(){
             msg("Register Audit", "Failed to register Audit Milestone");
             registerAuditWindow.close();
          }
       });
    },
    
    addNewReviewForRisk:function(){
       
        var values = $$('qrm-scheduleReviewFormID').getValues();
       values.NewOrOld = values.type;
       
       if (values.NewOrOld == 0) {
          values.scheduled = values.date;
          if (values.scheduled.length < 1 || values.description.length < 1){
             msg("Schedule Risk Review", "Please enter the review date and a brief description of the review");
             return;
          }
       } else {
          values.reviewID = $$("qrmID-ExistingReviewSelector").getValue();
       }
       
       values.riskIDs = getExplorerRiskIDs();

       Ext.Ajax.request({
          url: "./scheduleReview",
          params: {
             "DATA": Ext.encode(values),
             "PROJECTID": QRM.global.projectID
          },
          success: function (response) {
             if (scheduleReviewWindow.fromGrid){
                msg("Schedule Review", "Risk Review Scheduled");
             } else {
                QRM.app.getRiskEditorController().getRiskReviewData();                
             }
             scheduleReviewWindow.close();
          },
          
       });
    },

    
    reviewTypeSelectorChanged:function(form, newVal, oldVal){
       var state = (newVal.type == 1)?true:false;
       
       $$('qrmID-NewReviewDate').setDisabled(state);
       $$('qrmID-NewReviewDescription').setDisabled(state);
       $$('qrmID-ExistingReviewSelector').setDisabled(!state);
    }
});