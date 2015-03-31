/**
 * 
 */

var mitigationRowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
   clicksToMoveEditor: 1,
   autoCancel: false,
   listeners:{
    edit: {
         fn: function(editor, context){ 
            Ext.Ajax.request({
               url: "./newRiskMitigation",
               params: {
                  "PROJECTID":QRM.global.projectID,
                  "RISKID": QRM.global.currentRisk.riskID,
                  "MITIGATION": Ext.encode(context.record.data),
                  "RESPONSE":false,
                  "EXT":true
               },
               success: function(response){
                  var risk = Ext.decode(response.responseText);
                  if (risk){
                     QRM.global.currentRisk.mitigationPlan  = risk.mitigationPlan;
                     var mitPlan = risk.mitigationPlan.filter(function(element){
                        return (element.response == 0);
                     });

                     $$('qrmID-RiskEditorMitigationPlanGrid').store.loadData(mitPlan);
                     $$('qrmID-RiskEditorMitigationPlanGrid2').store.loadData(mitPlan);
                  }else {
                     Ext.Msg.show({
                        title: 'Update Mitigation Plan',
                        msg: '<center>You are not authorised to update the mitigation plan</center>',
                        width: 400,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                     });                     
                  }
               },
               failure:function(){
                  Ext.Msg.show({
                     title: 'Update Mitigation Plan',
                     msg: '<center>Error updating detail mitigation plan</center>',
                     width: 400,
                     buttons: Ext.Msg.OK,
                     icon: Ext.Msg.INFO
                 });
               }
            });
         }
    },
    canceledit: {
       fn: function(editor, context){ 
          var mitPlan = QRM.global.currentRisk.mitigationPlan.filter(function(element){
             return (element.response == 0);
          });

          $$('qrmID-RiskEditorMitigationPlanGrid').store.loadData(mitPlan);
          $$('qrmID-RiskEditorMitigationPlanGrid2').store.loadData(mitPlan);
       }
  }

   }
});
function handleDeleteMitStep(){
   mitigationRowEditing.cancelEdit();

   Ext.Msg.show({
      title: 'Delete Detail Mitigation Step',
      msg: '<center>Delete Selected Mitigation Step?</center>',
      width: 400,
      buttons: Ext.Msg.YESNO,
      fn: function (btn) {
         if (btn == "yes"){
            
            var data = getJSONSelection('qrmID-RiskEditorMitigationPlanGrid');
            Ext.Ajax.request({
               url: "./deleteRiskMitigation",
               params: {
                  "RISKID": QRM.global.currentRisk.riskID,
                  "DATA": data,
                  "PROJECTID":QRM.global.projectID,
                  "EXT":true
               },
               success: function(response){
                  var risk = Ext.decode(response.responseText);
                  if (risk){
                     
                     QRM.global.currentRisk.mitigationPlan  = risk.mitigationPlan;
                     var mitPlan = risk.mitigationPlan.filter(function(element){
                        return (element.response == 0);
                     });

                     $$('qrmID-RiskEditorMitigationPlanGrid').store.loadData(mitPlan);
                     $$('qrmID-RiskEditorMitigationPlanGrid2').store.loadData(mitPlan);
                     
                     Ext.Msg.show({
                        title: 'Delete Detail Mitigation Step',
                        msg: '<center>Mitigation Steps Deleted</center>',
                        width: 400,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                  } else {
                     Ext.Msg.show({
                        title: 'Delete Detail Mitigation Step',
                        msg: '<center>You do not have authorisation to delete mitigation steps</center>',
                        width: 400,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                  }
                  

               },
               failure:function(){
                  Ext.Msg.show({
                     title: 'Delete Detail Mitigation Step',
                     msg: '<center>Error deleting selected mitigation steps</center>',
                     width: 400,
                     buttons: Ext.Msg.OK,
                     icon: Ext.Msg.INFO
                 });
                  
  
               }
            });
         }
      },
      icon: Ext.Msg.QUESTION
  });
}
function handleNewMitStep(){
   mitigationRowEditing.cancelEdit();
   var r = Ext.create('MitigationStep', {
       mitstepID: -1,
       description:"Description of the Mitigation Step",
       updates:" - ",
       personID:QRM.global.userID,
       estCost:0,
       percentComplete:0,
       endDate:new Date()
   });

   $$('qrmID-RiskEditorMitigationPlanGrid').store.insert(0, r);
   mitigationRowEditing.startEdit(0, 0);
}
function handleMitManageUpdates(){
   
   mitigationUpdateRowEditing.cancelEdit();
   mitigationRowEditing.cancelEdit();
   
   var model = $$('qrmID-RiskEditorMitigationPlanGrid').getSelectionModel().getSelection()[0];
   if (!model){
      Ext.Msg.show({
         title: 'Manage Mitigation Updates',
         msg: '<center>Please select a detail mitigation step to manage the updates</center>',
         width: 400,
         buttons: Ext.Msg.OK,
         icon: Ext.Msg.INFO
     }); 
     return; 
   }

   if(mitigationUpdateEditor == null){
      mitigationUpdateEditor = Ext.create('QRM.view.editor.MitigationUpdates', {
      title: 'Detail Mitigation Steps Updates'
  });
  }
   mitigationUpdateEditor.show();
   var record = model.data;
   $$('qrm-MitigationUpdatesStepDescriptionID').update("<strong>Mitigation Detail Step</strong><br/><br/><em>"+record.description+"</em>");
   
   QRM.global.mitStepID = model.raw.mitstepID;
   
   mitigationUpdateCommentStore.load({ params: {
      "MITSTEPID": model.raw.mitstepID,
      "PROJECTID":QRM.global.projectID,
      "RISKID":QRM.global.currentRisk.riskID
   }
   });
}

Ext.define('QRM.view.editor.MitigationTab', {
    xtype: 'qrmXType-riskEditorMitigation',
    extend: "Ext.panel.Panel",
    border: false,
    layout: {
        type: 'vbox',
        padding: '0 0 0 0',
        align: 'stretch' // Child items are stretched to full width
    },
    items: [

            Ext.create('Ext.form.Panel', {
               id:'qrm-RiskEditorMitigationForm1',
               trackResetOnLoad:true,
                border: false,
                height: 180,
                fieldDefaults: {
                    labelAlign: 'top',
                    enableKeyEvents: true
                },
                layout: {
                    type: 'hbox',
                    align: 'stretch',
                    padding: 5
                },
                dockedItems: [{
                   xtype: 'toolbar',
                   dock: 'bottom',
                   ui: 'footer',
                   items: [{
                       xtype: 'component',
                       flex: 1
                   }, {
                       text: 'Cancel Changes',
                       width: 110,
                       id: 'qrmID-RiskEditorCancelBtn3'
                   }, {
                       text: 'Save Changes',
                       width: 110,
                       id: 'qrmID-RiskEditorSaveBtn3'
                   }]
               }],
                items: [{
                    xtype: 'textarea',
                    flex:1,
                    fieldLabel: 'Mitigation Plan Summary',
                    labelCls : 'field-container-label',
                    afterLabelTextTpl: required,
                    name:'mitPlanSummary',
                    allowBlank: false
                }, {
                    xtype: 'textarea',
                    padding:'0 0 0 10',
                    fieldLabel: 'Mitigation Plan Summary Update',
                    labelCls : 'field-container-label',
                    name:'mitPlanSummaryUpdate',
                    flex: 1,
                    allowBlank: true
                }  
                ]
            }),
            {
               html: "<strong>Detail Mitigation Plan</strong><br/><br/>",
               border: false
            },

            Ext.create('Ext.grid.Panel', {
               id:'qrmID-RiskEditorMitigationPlanGrid',
               collapsible: false,
               multiSelect: false,
               plugins:[mitigationRowEditing],
               store:new Ext.data.ArrayStore({
                  model:'MitigationStep',
                  idIndex: 0,
                  autoLoad: false
              }),
               selType: 'checkboxmodel',
               flex: 1,
               width: '100%',
               columns: [
               {
                   text: 'Description',
                   align:'left',
                   dataIndex:'description',
                   tdCls:'wrap-text',
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
                  text:'Updates',
                  align:'left',
                  dataIndex:'updates',
                  tdCls:'wrap-text',
                  flex:1
               },
               {
                  text:'Person Responsible',
                  width:200,
                  align:'center',
                  tdCls:'top-text',
                  dataIndex:'personID',
                  renderer: function (value, metaData, model, row, col, store, gridView) {
                     return allUsersMap.get(value).name;
                 },
                 editor:{
                    xtype:'combobox'
                 }
               },
               {
                  text:'Estimated Costs',
                  align:'center',
                  dataIndex:'estCost',
                  tdCls:'top-text',
                  width:150,
                  editor:{
                     xtype:'numberfield'
                  }
               },
               {
                  text:'% Complete',
                  dataIndex:'percentComplete',
                  width:100,
                  tdCls:'top-text',
                  align:'center',
                  editor:{
                     xtype:'numberfield',
                     minValue:0,
                     maxValue:100
                  }
               },
               {
                  text:'Date',
                  dataIndex:'endDate',
                  width:100,
                  tdCls:'top-text',
                 renderer:Ext.util.Format.dateRenderer('d M Y'),
                  align:'center',
                  editor:{
                     xtype:'datefield'
                  }
               }
               ],
               dockedItems: [{
                   xtype: 'toolbar',
                   dock: 'bottom',
                   ui: 'footer',
                   items: [
                           
                           {
                       xtype: 'component',
                       flex: 1
                   }, {
                       text: 'Manage Updates',
                       width:110,
                       handler:handleMitManageUpdates
                   }, {
                       text: 'Delete',
                       width:110,
                       handler:handleDeleteMitStep
                   },{
                      text:'New Detail Step',
                      width:110,
                      handler:handleNewMitStep
                   }
                   ]
               }],
           })
            ]
});