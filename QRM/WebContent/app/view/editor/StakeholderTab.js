/**
 * 
 */

Ext.define('QRM.view.editor.StakeholderTab', {
    xtype: 'qrmXType-riskEditorStakeholder',
    extend: "Ext.panel.Panel",
    border: false,
    layout: {
        type: 'vbox',
        padding: '0 0 0 0',
        align: 'stretch' // Child items are stretched to full width
    },

    items: [
            {
               html: "<strong>Contributing Stakeholders</strong><br/><br/>",
               border: false
            },

            Ext.create('Ext.grid.Panel', {
               id:'qrmID-RiskEditorResponseStakeholderGrid',
               collapsible: false,
               multiSelect: true,
               store:allRiskStakeholdersStore,
               selType: 'checkboxmodel',
               flex: 1,
               width: '100%',
               columns: [ {
                   text: 'Stakeholder',
                   align:'left',
                   dataIndex:'name',
                   width:250
               },
               {
                  text:'Email Address',
                  flex:1,
                  dataIndex:'email'
               },
               {
                  text:'Role',
                  width:300,
                  dataIndex:'compoundName'
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
                       text: 'Edit',
                       width:110
                   }, {
                       text: 'Delete',
                       width:110
                   },{
                      text:'Create New',
                      width:110
                   }
                   ]
               }],
           })

    ]
});