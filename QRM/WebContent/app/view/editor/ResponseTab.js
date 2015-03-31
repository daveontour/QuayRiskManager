/**
 * 
 */

var responseRowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
   clicksToMoveEditor: 1,
   autoCancel: false,
   listeners:{
    edit: {
         fn: function(editor, context){ 
            Ext.Ajax.request({
               //url handles new and updates
               url: "./newRiskMitigation",
               params: {
                  "PROJECTID":QRM.global.projectID,
                  "RISKID": QRM.global.currentRisk.riskID,
                  "MITIGATION": Ext.encode(context.record.data),
                  "RESPONSE":true,
                  "EXT":true
               },
               success: function(response){
                  var risk = Ext.decode(response.responseText);
                  if (risk){
                     QRM.global.currentRisk.mitigationPlan  = risk.mitigationPlan;
                     var respPlan = risk.mitigationPlan.filter(function(element){
                        return (element.response == 1);
                     });

                    $$('qrmID-RiskEditorResponsePlanGrid').store.loadData(respPlan);
                  }else {
                     Ext.Msg.show({
                        title: 'Update Mitigation Plan',
                        msg: '<center>You are not authorised to update the response plan</center>',
                        width: 400,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                     });                     
                  }
               },
               failure:function(){
                  Ext.Msg.show({
                     title: 'Update Response Plan',
                     msg: '<center>Error updating response plan</center>',
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
          var respPlan = QRM.global.currentRisk.mitigationPlan.filter(function(element){
             return (element.response == 1);
          });

         $$('qrmID-RiskEditorResponsePlanGrid').store.loadData(respPlan);

       }
  }
   }
});
function handleDeleteResponseStep(){
   mitigationRowEditing.cancelEdit();

   Ext.Msg.show({
      title: 'Delete Detail Response Action',
      msg: '<center>Delete Selected Response Action?</center>',
      width: 400,
      buttons: Ext.Msg.YESNO,
      fn: function (btn) {
         if (btn == "yes"){
            
            var data = getJSONSelection('qrmID-RiskEditorResponsePlanGrid');
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
                     var respPlan = risk.mitigationPlan.filter(function(element){
                        return (element.response == 1);
                     });

                     $$('qrmID-RiskEditorResponsePlanGrid').store.loadData(respPlan);
                     
                     Ext.Msg.show({
                        title: 'Delete Response Action',
                        msg: '<center>Response Actions Deleted</center>',
                        width: 400,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                  } else {
                     Ext.Msg.show({
                        title: 'Delete Response Action',
                        msg: '<center>You do not have authorisation to delete Response Actions</center>',
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
function handleNewResponseStep(){
   responseRowEditing.cancelEdit();
   var r = Ext.create('MitigationStep', {
       mitstepID: -1,
       description:"Description of the Response Action",
       updates:" - ",
       personID:QRM.global.userID,
       estCost:0,
       percentComplete:0,
       endDate:new Date()
   });

   $$('qrmID-RiskEditorResponsePlanGrid').store.insert(0, r);
   responseRowEditing.startEdit(0, 0);
}


Ext.define('QRM.view.editor.ResponseTab', {
    xtype: 'qrmXType-riskEditorResponse',
    extend: "Ext.panel.Panel",
    border: false,
    layout: {
        type: 'vbox',
        padding: '0 0 0 0',
        align: 'stretch' // Child items are stretched to full width
    },

    items: [
            {
               html: "<strong>Reponse Plan</strong><br/><br/>",
               border: false
            },

            Ext.create('Ext.grid.Panel', {
               id:'qrmID-RiskEditorResponsePlanGrid',
               collapsible: false,
               plugins: [responseRowEditing],
              multiSelect: true,
               store:new Ext.data.ArrayStore({
                  model:'MitigationStep',
                  idIndex: 0,
                  autoLoad: false
              }),
               selType: 'checkboxmodel',
               flex: 1,
               width: '100%',
               columns: [ {
                  text: 'Description',
                  align:'left',
                  tdCls:'wrap-text',
                  dataIndex:'description',
                  flex:1,
                  editor:{
                     xtype:'textarea',
                     allowBlank: false,
                     autoSizing:true,
                     height:70
                  }

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
                       text: 'Delete',
                       width:110,
                       handler:handleDeleteResponseStep
                   },{
                      text:'New Response Action',
                      width:145,
                      handler:handleNewResponseStep
                   }
                   ]
               }],
           })
    ]
});