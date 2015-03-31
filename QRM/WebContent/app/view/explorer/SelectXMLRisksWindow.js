/**
 * 
 */

Ext.define('QRM.view.explorer.SelectXMLRisksWindow', {
    extend: "Ext.window.Window",
    title: 'Select the risks you wish to import',
    border: false,
    id:"qrmID-SelectXMLRisksWindow",
    modal: true,
    draggable: true,
    closeAction: 'hide',
    height: 600,
    width: 1100,
    padding: ' 0 0 0 0',
    border:false,
    layout:'border',
    items: [{
        html: "<strong>Importing Risks</strong><br/><br/>Select the risks you wish to import<br/>",
        padding: '5 5 5 5',
        region: 'north',
        border: false,
        style: {
           backgroundColor:'white'
       }
        
    },Ext.create('Ext.grid.Panel', {
       padding: '5 5 5 5',
       selType: 'checkboxmodel',
       style: {
          backgroundColor:'white'
      },
       border:0,
       region:'center',
       multiSelect: true,
       id:'qrmID-SelectXMLRiskImportGrid',
       store:Ext.create('Ext.data.ArrayStore', {
          fields:['title']
       }),
       width:'100%',
       columns:[ {
          text: 'Title',
          flex: 1,
          dataIndex: 'title'
      }]
       }
   )
    ],
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        ui: 'footer',
        items: [
            "->", {
            text: 'Cancel',
            width: 110,
            handler: function () {
                $$("qrmID-SelectXMLRisksWindow").close();
            }
        }, {
            text: 'Import',
            width: 110,
            id: 'qrmID-ImportRiskImportBtn'
        }]
    }]
});
