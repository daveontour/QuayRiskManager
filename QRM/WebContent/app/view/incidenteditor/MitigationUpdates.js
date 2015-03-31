/**
 * 
 */

function handleMitigationUpdateDelete(){
   Ext.Msg.show({
      title: 'Delete Mitgation Step Update',
      msg: '<center>Delete Selected Update?</center>',
      width: 400,
      buttons: Ext.Msg.YESNO,
      fn: function (btn) {
         if (btn == "yes"){
            
            var data = getJSONSelection('qrmID-MitigationUpdateGridID');
            Ext.Ajax.request({
               url: "./deleteMitStepUpdate",
               params: {
                  "RISKID": QRM.global.currentRisk.riskID,
                  "DATA":data,
                  "PROJECTID":QRM.global.projectID,
                  "EXT":true
               },
               success: function(response){
                  var risk = Ext.decode(response.responseText);
                  if (risk){
                     QRM.global.currentRisk.controls = risk.controls;
                     msg('Delete Mitgation Step Update','Updates Deleted');                 
                 } else {
                     msg('Delete Mitgation Step Update','You do not have authorisation to delete updates');                 
                   }
                  
                  QRM.global.currentRisk.mitigationPlan  = risk.mitigationPlan;
                  var mitPlan = risk.mitigationPlan.filter(function(element){
                     return (element.response == 0);
                  });
                  
                  $$('qrmID-RiskEditorMitigationPlanGrid').store.loadData(mitPlan);
                  $$('qrmID-RiskEditorMitigationPlanGrid2').store.loadData(mitPlan);

                  mitigationUpdateCommentStore.load({ params: {
                      "MITSTEPID": QRM.global.mitStepID,
                      "PROJECTID":QRM.global.projectID,
                      "RISKID":QRM.global.currentRisk.riskID
                   }});                  

               },
               failure:function(){
                  msg('Delete Mitgation Step Update','Error deleting selected update');                 
               }
            });
         }
      },
      icon: Ext.Msg.QUESTION
  });

}

function handleNewMitigationUpdate(){
   mitigationUpdateRowEditing.cancelEdit();
   var r = Ext.create('MitUpdateComment', {
       description: 'Comments on the detail mitigation step',
       personID:QRM.global.userID,
       dateEntered: new Date(),
       internalID: -1,
       hostID:QRM.global.mitStepID
   });

   $$('qrmID-MitigationUpdateGridID').store.insert(0, r);
   mitigationUpdateRowEditing.startEdit(0, 0);
}

var mitigationUpdateRowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
   clicksToMoveEditor: 1,
   autoCancel: false,
   listeners:{
    edit: {
         fn: function(editor, context){
            var stepID = context.record.data.hostID;
            Ext.Ajax.request({
               url: "./addMitigationUpdate",
               params: {
                  "PROJECTID":QRM.global.projectID,
                  "RISKID": QRM.global.currentRisk.riskID,
                  "UPDATE": context.record.data.description,
                  "INTERNALID":context.record.data.internalID,
                  "MITSTEPID":context.record.data.hostID,
                  "EXT":true
               },
               success: function(response){
                  
                 var risk = Ext.decode(response.responseText);
                 QRM.global.currentRisk.mitigationPlan  = risk.mitigationPlan;
                 var mitPlan = risk.mitigationPlan.filter(function(element){
                    return (element.response == 0);
                 });
                 
                 $$('qrmID-RiskEditorMitigationPlanGrid').store.loadData(mitPlan);
                 $$('qrmID-RiskEditorMitigationPlanGrid2').store.loadData(mitPlan);

                 mitigationUpdateCommentStore.load({ params: {
                     "MITSTEPID": stepID,
                     "PROJECTID":QRM.global.projectID,
                     "RISKID":QRM.global.currentRisk.riskID
                  }});
                 
               },
               failure:function(){
                  Ext.Msg.show({
                     title: 'Update Mitigation Step Comment',
                     msg: '<center>Error updating comments</center>',
                     width: 400,
                     buttons: Ext.Msg.OK,
                     icon: Ext.Msg.INFO
                 });
                  mitigationUpdateCommentStore.load({ params: {
                     "MITSTEPID": stepID,
                     "PROJECTID":QRM.global.projectID,
                     "RISKID":QRM.global.currentRisk.riskID
                  }});     
                  }
            });
         }
    },
    canceledit: {
       fn: function(editor, context){ 
          var stepID = context.record.data.hostID;

          var mitPlan = QRM.global.currentRisk.mitigationPlan.filter(function(element){
             return (element.response == 0);
          });

          $$('qrmID-RiskEditorMitigationPlanGrid').store.loadData(mitPlan);
          $$('qrmID-RiskEditorMitigationPlanGrid2').store.loadData(mitPlan);
          
          mitigationUpdateCommentStore.load({ params: {
             "MITSTEPID": stepID,
             "PROJECTID":QRM.global.projectID,
             "RISKID":QRM.global.currentRisk.riskID
          }});
       }
  }
   }
});

Ext.define('QRM.view.editor.MitigationUpdates', {
    xtype: 'qrmXType-mitigationUpdateEditor',
    extend: "Ext.window.Window",
    id:'qrm-RiskEditorMitigationUpdateWindowID',
    border: false,
    modal: true,
    draggable: false,
    closeAction: 'hide',
    height: "60%",
    width: "60%",
    layout: 'vbox',
    align:'stretch',
    store: mitigationUpdateCommentStore,
    padding:"5 5 5 5",
    items: [
            {
               id:'qrm-MitigationUpdatesStepDescriptionID',
               xtype:'panel',
               html:'The description of the step',
               height:100,
               border:false,
               width:"100%"
            },
            {
               html:"<strong>Updates</strong>",
               xtype:'panel',
               border:false,
               width:"100%"
            },
            Ext.create('Ext.grid.Panel', {
               id:'qrmID-MitigationUpdateGridID',
               collapsible: false,
               multiSelect: true,
               plugins:[mitigationUpdateRowEditing],
               store:mitigationUpdateCommentStore,
               selType: 'checkboxmodel',
               flex: 1,
               width: '100%',
               columns: [ {
                   text: 'Update',
                   align:'left',
                   tdCls:'wrap-text',
                   dataIndex:'description',
                   flex:1,
                   editor: {
                      xtype:'textarea',
                      allowBlank: false,
                      autoSizing:true,
                      height:70,
                      listeners: {
                         inputEl: {
                             keydown: function(ev) {
                                 ev.stopPropagation();
                             }
                         }
                     }
                  }
               },
               {
                  text:'Stakeholder',
                  dataIndex:'personID',
                  width:200,
                  align:'center',
                  tdCls:'top-text',
                  renderer: function (value, metaData, model, row, col, store, gridView) {
                     return allUsersMap.get(value).name;
                 },
               },
               {
                  text:'Date',
                  dataIndex:'dateEntered',
                  width:150,
                  tdCls:'top-text',
                  align:'center',
                  renderer:Ext.util.Format.dateRenderer('d M Y')
               }
               ],
               dockedItems: [{
                   xtype: 'toolbar',
                   dock: 'bottom',
                   ui: 'footer',
                   items: [{
                       xtype: 'component',
                       flex: 1
                   }, {
                       text: 'Delete Update',
                       width:110,
                       handler: handleMitigationUpdateDelete

                   },{
                      text:'New Update',
                      width:110,
                      handler: handleNewMitigationUpdate
                    }
                   ]
               }],
           })
            ]
});