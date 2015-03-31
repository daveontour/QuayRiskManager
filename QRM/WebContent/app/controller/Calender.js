/**
 * 
 */
Ext.define('QRM.controller.Calender', {
   extend: 'Ext.app.Controller',
   views: ['calender.CalenderPanel'],
   listenForEditorChanges:false,
   editorChanges:false,
   init: function () {    
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
     debugger;
         if (this.listenForEditorChanges && this.editorChanges){
            this.switchProject(QRM.global.project, $$('cbDescendants').value);
         }
         this.listenForEditorChanges = false;
         this.editorChanges = false;
      },    
  riskChanges:function(){
     debugger;
     this.editorChanges = true;
  },

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
      
      var  p = {
            "DESCENDANTS": desc,
                "PROJECTID": project.projectID,
                "PROCESSFILTER": true,
                "TOLEX": $$('cbExtreme').value,
                "TOLHIGH": $$('cbHigh').value,
                "TOLSIG": $$('cbSignificant').value,
                "TOLMOD": $$('cbModerate').value,
                "TOLLOW": $$('cbLow').value,
                "STATACTIVE": $$('cbActive').value,
                "STATPENDING": $$('cbPending').value,
                "STATINACTIVE": $$('cbInactive').value,
                "STATTREATED": $$('cbTreated').value,
                "STATUNTREATED": $$('cbUntreated').value,
                "CATID": $$('comboCategory').getValue(),
                "OWNERID": $$('comboRiskOwner').getValue(),
                "MANAGERID": $$('comboRiskManager').getValue()
        };
      if (QRM.global.viewState=="Rolled") {
         p.ROLLED = true;
      }
       Ext.data.StoreManager.get('Explorer').load({
           params: p,
           callback:function(records, operation, success){
              var tasks = new Array();
              var taskNames = new Array();
              
              Ext.data.StoreManager.get('Explorer').data.items.forEach(function (item){
                 var risk = item.data;
                 tasks.push({"startDate":risk.startExposure, "endDate":risk.endExposure, "taskName":risk.riskProjectCode, "status":"RUNNING"});
              });

              var now = new Date();
              tasks.sort(function(a, b) {return a.startDate - b.startDate; });
              tasks.forEach(function(task){
                 if (task.startDate > now){
                    task.className = 'future';
                 } else if( task.endDate < now){
                    task.className = 'past';
                 } else {
                    task.className = 'now';
                 }
                 taskNames.push(task.taskName);
              });

              d3.select("#svgcalID").selectAll("svg").remove();
              
              var gantt = d3.gantt().taskTypes(taskNames).tickFormat("%b %Y");
              gantt(tasks, "#svgcalID",$$('qrm-RiskCalenderPanel').getWidth(), $$('qrm-RiskCalenderPanel').getHeight());
           }
       });
   }   
});