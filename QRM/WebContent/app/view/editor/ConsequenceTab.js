/**
 * 
 */

Ext.define('QRM.view.editor.ConsequenceTab', {
    xtype: 'qrmXType-riskEditorConsequence',
    extend: "Ext.panel.Panel",
    border: false,
    layout: {
        type: 'vbox',
        padding: '5 5 5 5',
        align: 'stretch' // Child items are stretched to full width
    },

    items: [{
        html: "<strong>Risk Consequences</strong><br/><br/>",
        border: false
    },

    Ext.create('Ext.grid.Panel', {
        id: 'qrmID-RiskEditorConsequenceGrid',
        collapsible: false,
        multiSelect: false,
        store: consequenceStore,
        selType: 'checkboxmodel',
        flex: 1,
        width: '100%',
        columns: [{
            text: 'Consequences',
            align: 'left',
            dataIndex: 'description',
            flex: 1
        }, {
            text: 'Type',
            width: 300,
            dataIndex: 'description',
            renderer: function (value, metaData, model, row, col, store, gridView) {
                  return model.raw.quantImpactType.description;
            }
        }, {
            text: 'Prob',
            width: 60,
            dataIndex: 'riskConsequenceProb',
            align:'center',
            renderer: function (value, metaData, model, row, col, store, gridView) {
               var record = model.raw;
               try {
                  if (QRM.global.currentRisk.treated) {
                     return record.postRiskConsequenceProb+"%";
                  } else {
                     return record.riskConsequenceProb+"%";
                  }
               } catch (e) {
                  return "Unknown";
               }
            }
        }, {
            text: 'Distribution',
            width: 200,
            dataIndex: 'costDistributionType',
            renderer: function (value, metaData, model, row, col, store, gridView) {
               var record = model.raw;
               try {
                  if (QRM.global.currentRisk.treated) {
                     return QRM.global.distributionTypeMap.get(record.postCostDistributionType);
                  } else {
                     return QRM.global.distributionTypeMap.get(record.costDistributionType);
                  }
               } catch (e) {
                  return "Error";
               }
            }
        }],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            items: [{
                xtype: 'component',
                flex: 1
            }, {
                text: 'Delete',
                width: 110,
                id:'qrm-RiskEditorConsequenceTabDeleteConsequenceBtnID'
            }, {
                text: 'Create New',
                width: 110,
                id:'qrm-RiskEditorConsequenceTabNewConsequenceBtnID'
            }]
        },{
           id:'qrm-UsingSuppliedContingencyPanelID',
           html:"<center><strong>Risk Configured to Use Supplied Contingency. Cost contingenct not Calculated</strong></center>",
           height:20,
           border:false,
           bodyStyle:{
              background:"#ff0"
           }
              
              
        }],
    }), {
        xtype: 'panel',
        height: 300,
        layout: 'border',
        border: false,
        items: [

        Ext.create('Ext.form.Panel', {
            id: 'qrm-RiskEditorConsequenceForm',
            border: false,
            region: 'west',
            width: 300,
            hideEmptyLabel: false,
            fieldDefaults: {
                labelAlign: 'right',
                labelWidth: 200,
                enableKeyEvents: true
            },
            layout: {
                type: 'vbox',
                padding: '10 20 30 10',
                align: 'stretch' // Child items are stretched to full width
            },
            items: [{
                html: '<strong>Calculate Contingency</strong><br/><br/>',
                border: false
            }, {
                xtype: 'numberfield',
                fieldLabel: 'Contingency Percentile',
                id: 'qrm-RiskEditorConsequencesContingencyPercentileID',
                minValue: 0,
                value: 90,
                maxValue: 100,
                width: 100
            }, {
               xtype: 'button',
               text: 'Calculate Contingency',
               id:'qrm-calcContincencyButtonID'
                  
            }, {
                border: false,
                html: "<br/>"
            }, {
                xtype: 'label',
                text: "Un Treated",
                style: {
                    color: 'red'
                }
            }, {
                xtype: 'displayfield',
                id: 'qrm-RiskEditorConsequencesUContID',
                name: "preMitContingency",
                fieldLabel: 'Contingency',
                value: '-'
            }, {

                xtype: 'displayfield',
                id: 'qrm-RiskEditorConsequencesWUContID',
                name: "preMitContingencyWeighted",
               fieldLabel: 'Weighted Conteingency',
                value: '-'
            }, {
                xtype: 'label',
                text: "Treated",
                style: {
                    color: 'blue'
                }
            }, {

                xtype: 'displayfield',
                id: 'qrm-RiskEditorConsequencesContID',
                name: "postMitContingency",
                fieldLabel: 'Contingency',
                value: '-'
            }, {

                xtype: 'displayfield',
                name: "postMitContingencyWeighted",
                id: 'qrm-RiskEditorConsequencesWContID',
                fieldLabel: 'Weighted Conteingency',
                value: '-'
            }, {
                border: false,
                html: "<br/>"
            }, {
                xtype: 'button',
                text: 'Save Conteingency Values'
            }]
        }),

        {
            xtype: 'panel',
            border: false,
            id: 'qrm-RiskEditorConsequenceContingencyGraphID',
            region: 'center'
        },
        Ext.create('Ext.form.Panel', {
            id: 'qrm-RiskEditorConsequenceForm2',
            border: false,
            region: 'east',
            width: 200,
            hideEmptyLabel: false,
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 200
            },
            layout: {
                type: 'vbox',
                padding: '10 20 30 10',
                align: 'stretch' // Child items are stretched to full width
            },
            items: [{
                xtype: 'radiogroup',
                id: 'qrmID-RiskEditorConsequenceTreatmentGroup',
                fieldLabel: 'Select Treatment State',
                allowBlank: false,
                columns: 1,
                vertical: true,
                items: [{
                    boxLabel: 'UnTreated',
                    name: 'treatmentState',
                    checked: true,
                    inputValue: "UnTreated"
                }, {
                    boxLabel: 'Treated',
                    name: 'treatmentState',
                    inputValue: "Treated"
                }]
            }]
        })

        ]
    }
    ]
});