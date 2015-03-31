/**
 * 
 */
Ext.define('QRM.controller.Overview', {
   extend: 'Ext.app.Controller',
   views:['overview.Overview'],
   okToSwitchProject: function(){
      return true;
   },
   okToSwitchTab: function(){
      return true;
   },
   switchTab: function(){
      this.switchProject(QRM.global.project, $$('cbDescendants').value);
      this.loadOverviewData();
      this.loadEventsData();
      this.loadMetricData();
   },
   resizePanel:function(){
      this.switchProject(QRM.global.project, $$('cbDescendants').value); 
   },
   switchProject : function(project, desc){
      this.loadOverviewData();
      this.loadEventsData();
      this.loadMetricData();
//
   },
   loadEventsData:function(){
      sigEventsStore.load({params:{
         "DESCENDANTS": $$('cbDescendants').value,
         "PROJECTID": QRM.global.projectID
      }
      }); 
   },
   loadOverviewData:function(){
      metricOverviewData.load({params:{
         "DESCENDANTS": $$('cbDescendants').value,
         "PROJECTID": QRM.global.projectID
      }
      }); 
   },
   loadMetricData:function(){
      Ext.Array.each(QRM.global.project.metrics, function(met){
         switch(met[0]){
               case "mitPlans":
               store4.loadData(met[1]);
               break;
               case "status":
               store1.loadData(met[1]);
               break;
               case "treatment":
               store2.loadData(met[1]);
               break;
               case "tolerance":
               store3.loadData(met[1]);
               break;
         }
   });
   }
});