/**
 * 
 */



Ext.define('QRM.view.editor.RegisterAuditWindow', {
   xtype: 'qrmXType-RegisterAuditWindow',
   extend: "Ext.window.Window",
   title:'Register New Audit Milestone',
   border: false,
   modal: true,
   draggable: false,
   closeAction: 'hide',
   height: 400,
   width: 600,
   layout: 'vbox',
   align:'stretch',
   padding:"5 5 5 5",
   dockedItems: [{
      xtype: 'toolbar',
      dock: 'bottom',
      ui: 'footer',
      items: [
              {
                 xtype: 'component',
                 flex: 1
              }, {
                 text: 'Cancel',
                 width:110,
                 handler: function (){
                    registerAuditWindow.close();
                 }
              },{
                 text:'Save',
                 width:110,
                 id:'qrmID-RiskEditorAddNewAuditBtn'
              }
              ]
   }],
   items: [
           Ext.create('Ext.form.Panel', {
              id:'qrm-registerAuditFormID',
              width:'100%',
              flex:1,
              trackResetOnLoad:true,
              border: false,
              hideEmptyLabel: false,
              fieldDefaults: {
                 labelAlign: 'top',
                 msgTarget: 'side'
             },
              layout: {
                 type: 'vbox',
                 padding: '5 5 5 5',
                 align: 'stretch' // Child items are stretched to full width
              },
              items: [ 
                      {
                         xtype: 'radiogroup',
                         fieldLabel: 'Audit Type',
                         labelAlign:'left',
                         allowBlank:false,
                         layout: {
                            type: 'table',
                            columns: 2,
                            tdAttrs: {
                               style: {
                                  width: 180
                               }
                            }
                         },
                         items: [{
                            boxLabel: 'Identification Reviewed',
                            name: 'type',
                            inputValue: 1
                         }, {
                            boxLabel: 'Identification Approved',
                            name: 'type',
                            inputValue: 2
                         }, {
                            boxLabel: 'Evaluation Reviewed',
                            name: 'type',
                            inputValue: 3
                         }, {
                            boxLabel: 'Evaluation Approved',
                            name: 'type',
                            inputValue: 4
                         }, {
                            boxLabel: 'Mitigation Reviewed',
                            name: 'type',
                            inputValue: 5
                         }, {
                            boxLabel: 'Mitigation Approved',
                            name: 'type',
                            inputValue: 6
                         }]
                      },{
                         xtype:"textarea",
                         name :'comment',
                         fieldLabel:'Audit Comment',
                         flex:1
                      }

                      ]
           })
           ]
});
