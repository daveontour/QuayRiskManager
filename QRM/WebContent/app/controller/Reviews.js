/**
 * 
 */
Ext.define('QRM.controller.Reviews', {
   extend: 'Ext.app.Controller',
   okToSwitchProject: function(){
      return true;
   },
   okToSwitchTab: function(){
      return true;
   },
   switchTab: function(){
      this.switchProject(QRM.global.project, $$('cbDescendants').value);
   },
   resizePanel:function(){
      this.switchProject(QRM.global.project, $$('cbDescendants').value); 
   },
   switchProject : function(project, desc){
//
   }   
   });