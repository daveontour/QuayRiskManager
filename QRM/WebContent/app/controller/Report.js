/**
 * 
 */
Ext.define('QRM.controller.Report', {
   extend: 'Ext.app.Controller',
   stores:['UserJob'],
   views: ['report.ReportPanel','report.UserJobGrid'],

   init: function(){
     this.control(
        {'#qrm-ReportDeleteUserJobBtn': {
           click: this.deleteUserJobs
        }
     }); 
     this.control(
           {'#qrm-ReportRefreshJobsBtn': {
              click: this.refreshReportJobs
           }
        });
    },
   deleteUserJobs:function(){
      
      Ext.Msg.show({
         title: 'Delete User Report Jobs',
         msg: '<center>Are you sure you wish to delete the selected jobs?</center>',
         width: 300,
         buttons: Ext.Msg.YESNO,
         fn: function(btn){

             if (btn != 'yes') {
                return;
             }
             
             Ext.Ajax.request({
                url: "./deleteUserJobs",
                params: {
                   "DATA": getJSONSelection('qrm-ReportStatusGrid')
                },
                success: function(response){
                   QRM.app.getReportController().refreshReportJobs();
                }

             });
          },
         icon: Ext.Msg.QUESTION
     });
     

   }, 
   okToSwitchProject: function(){
      return true;
   },
   okToSwitchTab: function(){
      return true;
   },
   switchTab: function(){
      this.refreshReportJobs();
   },
   switchProject : function(project, desc){
      return;
   },
   resizePanel:function(){
      return;
   },
   refreshReportJobs:function(){
      Ext.data.StoreManager.get('UserJob').load();
   }
});