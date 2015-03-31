/**
 * 
 */
Ext.define('QRM.controller.Review', {
   extend: 'Ext.app.Controller',
   views: ['review.ReviewGrid' ],
   stores:['Review'],

   init: function() {
//
   },

   okToSwitchProject: function(){
      return true;
   },
   okToSwitchTab: function(){
      return true;
   },
   resizePanel:function(){
      return; 
   },
   switchTab: function(){
      this.populateGrid();
   },

   switchProject : function(project, desc){
      this.populateGrid(project.projectID, desc);
   },
   populateGrid: function(){
         Ext.data.StoreManager.get('Review').load();
   },
   populateGridRiskSearch: function(){
      Ext.data.StoreManager.get('Review').load({params:{
        "riskCode": $$('reviewRiskSearchCode').value
     }
     });
},

});