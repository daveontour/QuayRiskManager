/**
 * 
 */

var controlRowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
   clicksToMoveEditor: 1,
   autoCancel: false,
   listeners:{
    edit: {
         fn: function(editor, context){ 
            Ext.Ajax.request({
               url: "./saveRiskControls",
               params: {
                  "PROJECTID":QRM.global.projectID,
                  "RISKID": QRM.global.currentRisk.riskID,
                  "CONTROL": Ext.encode(context.record.data),
                  "EXT":true
               },
               success: function(response){
                   var risk = Ext.decode(response.responseText);
                  // A risk object with the updated controls is returned, copy into the currentRisk and update store
                  QRM.global.currentRisk.controls = risk.controls;
                  $$('qrmID-RiskEditorControlGrid').store.loadData(QRM.global.currentRisk.controls);
               },
               failure:function(){
                  Ext.Msg.show({
                     title: 'Update Control',
                     msg: '<center>Error updating controls</center>',
                     width: 400,
                     buttons: Ext.Msg.OK,
                     icon: Ext.Msg.INFO
                 });
                  $$('qrmID-RiskEditorControlGrid').store.loadData(QRM.global.currentRisk.controls);
               }
            });
         }
    },
    canceledit: {
       fn: function(editor, context){ 
          $$('qrmID-RiskEditorControlGrid').store.loadData(QRM.global.currentRisk.controls);
       }
  }
   }
});
function handleDeleteControl(){
   Ext.Msg.show({
      title: 'Delete Control',
      msg: '<center>Delete Selected Controls?</center>',
      width: 400,
      buttons: Ext.Msg.YESNO,
      fn: function (btn) {
         if (btn == "yes"){
            
            var data = getJSONSelection('qrmID-RiskEditorControlGrid');
            Ext.Ajax.request({
               url: "./deleteRiskControl",
               params: {
                  "RISKID": QRM.global.currentRisk.riskID,
                  "DATA": data,
                  "PROJECTID":QRM.global.projectID,
                  "EXT":true
               },
               success: function(response){
                  var risk = Ext.decode(response.responseText);
                  if (risk){
                     QRM.global.currentRisk.controls = risk.controls;
                     Ext.Msg.show({
                        title: 'Delete Control',
                        msg: '<center>Controls Deleted</center>',
                        width: 400,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                  } else {
                     Ext.Msg.show({
                        title: 'Delete Control',
                        msg: '<center>You do not have authorisation to delete controls</center>',
                        width: 400,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                  }
                  
                  //return the new list of control, add them to the current Risk and update store
                  $$('qrmID-RiskEditorControlGrid').store.loadData(QRM.global.currentRisk.controls);
                  

               },
               failure:function(){
                  Ext.Msg.show({
                     title: 'Delete Control',
                     msg: '<center>Error deleting selected controls</center>',
                     width: 400,
                     buttons: Ext.Msg.OK,
                     icon: Ext.Msg.INFO
                 });
                  
                 $$('qrmID-RiskEditorControlGrid').store.loadData(QRM.global.currentRisk.controls);
  
               }
            });
         }
      },
      icon: Ext.Msg.QUESTION
  });
}
function handleNewControl(){
   controlRowEditing.cancelEdit();
   var r = Ext.create('RiskControl', {
       control: 'Enter Details of Control',
       contribution:'e.g. Prevents unauthorised access',
       effectiveness: 1,
       internalID: -1
   });

   $$('qrmID-RiskEditorControlGrid').store.insert(0, r);
   controlRowEditing.startEdit(0, 0);
}

Ext.define('QRM.view.editor.ControlTab', {
    xtype: 'qrmXType-riskEditorControl',
    extend: "Ext.panel.Panel",
    border: false,
    layout: {
        type: 'vbox',
        padding: '0 0 0 0',
        align: 'stretch' // Child items are stretched to full width
    },


    items: [
            {
               html: "<strong>Risk Controls</strong><br/><br/>",
               border: false
            },

            Ext.create('Ext.grid.Panel', {
               id:'qrmID-RiskEditorControlGrid',
               collapsible: false,
               multiSelect: true,
               plugins:[controlRowEditing],
               store:new Ext.data.ArrayStore({
                  model:'RiskControl',
                  idIndex: 0,
                  autoLoad: false
              }),
               selType: 'checkboxmodel',
               flex: 1,
               width: '100%',
               columns: [ {
                   text: 'Control',
                   align:'left',
                   tdCls:'wrap-text',
                   dataIndex:'control',
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
                  text:'Contribution',
                  dataIndex:'contribution',
                  width:300,
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
                  text:'Effectiveness',
                  dataIndex:'effectiveness',
                  width:150,
                  renderer: function (value, metaData, model, row, col, store, gridView) {
                     switch(value){
                        case 1:  
                           return "Ad Hoc";
                           break;
                        case 2:  
                           return "Repeatable";
                           break;
                        case 3:  
                           return "Documented";
                           break;
                        case 4:  
                           return "Integrated";
                           break;
                        case 5:  
                           return "Optimised";
                           break;
                     }
                  },
                  editor: {
                     xtype: 'combobox',
                     store: [
                         [1,'Ad Hoc'],
                         [2,'Repeatable'],
                         [3,'Documented'],
                         [4,'Integrated'],
                         [5,'Optimised']
                     ]
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
                       handler: handleDeleteControl

                   },{
                      text:'Create New',
                      width:110,
                      handler: handleNewControl
                    }
                   ]
               }],
           })
    ]
});