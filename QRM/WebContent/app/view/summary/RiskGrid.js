Ext.define('QRM.view.summary.RiskGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'qrm-summaryrisk-grid',
    id:"qrm-summaryrisk-gridID",
    collapsible: false,
    multiSelect: false,
    store:'Explorer',
    width:'100%',
    columns : [
               {
                  text:'Risk',
                  flex :1,
                  dataIndex:'title',
                  renderer: function (value, metaData, record, row, col, store, gridView) {
                     return record.data.riskProjectCode+" - "+value;
                  }
               }
     ],
     viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            enableDrop:false,
            ddGroup: 'summRiskDD'
        },
        listeners: {
           itemmouseenter: function (view, record, item, index, e, eOpts) {
               var data = record.data;
               Ext.getCmp('qrmID-summaryPanelPropertyViewer').setSource({
                  "Risk Code":data.riskProjectCode,
                  "Title":data.title,
                  "Description":data.description,
                  "Owner":data.ownerName,
                  "Manager":data.manager1Name
               });           }
       }
    },

}); 