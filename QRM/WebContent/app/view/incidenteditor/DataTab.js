/**
 * 
 */

Ext.define('QRM.view.editor.DataTab', {
    xtype: 'qrmXType-riskEditorData',
    extend: "Ext.panel.Panel",
    border: false,
    layout: {
        type: 'hbox',
        padding: '5 5 5 5',
        align: 'stretch' // Child items are stretched to full width
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
           id: 'qrmID-RiskEditorCancelBtn1'
       }, {
           text: 'Save Changes',
           width: 110,
           id: 'qrmID-RiskEditorSaveBtn1'
       }]
   }],
    items: [
    Ext.create('Ext.form.Panel', {
        id:'qrm-RiskEditorDataForm2',
        trackResetOnLoad:true,
        border: false,
        width: 440,
        hideEmptyLabel: false,
        fieldDefaults: {
            labelAlign: 'right',
            labelWidth: 140,
            enableKeyEvents: true
        },
        layout: {
            type: 'vbox',
            padding: '10 20 30 10',
            align: 'stretch' // Child items are stretched to full width
        },
        items: [{
            xtype: 'combobox',
            fieldLabel: 'Risk Owner',
            forceSelection: true,
            displayField: 'name',
            id:'qrmID-RiskEditorRiskOwner',
            name:'ownerID',
            valueField: 'stakeholderID',
            allowBlank: true,
            queryMode: 'local'
        }, {
            xtype: 'combobox',
            fieldLabel: 'Risk Manager',
            forceSelection: true,
            displayField: 'name',
            id:'qrmID-RiskEditorRiskManager',
            name:'manager1ID',
            valueField: 'stakeholderID',
            allowBlank: true,
            queryMode: 'local'
        }, {
            xtype: 'datefield',
            name:'startExposure',
            format:'d M Y',
            fieldLabel: 'Start of Exposure'
        }, {
            xtype: 'datefield',
            name:'endExposure',
            format:'d M Y',
            fieldLabel: 'End of Exposure'
        }, {
            xtype: 'fieldcontainer',
            fieldLabel: 'Impact',
            defaultType: 'checkboxfield',
            layout: {
                type: 'table',
                columns: 2,
                tdAttrs: {
                    style: {
                        width: 120
                    }
                }
            },
            defaults: {
                layout: '100%'
            },
            fieldDefaults: {
                msgTarget: 'under',
                labelAlign: 'right'
            },
            items: [

            {
                boxLabel: 'Reputation',
                name:'impReputation'                  
            }, {
                boxLabel: 'Human Safety',
                name:'impSafety'
            }, {
                boxLabel: 'Specification',
                name:'impSpec'
            }, {
                boxLabel: 'Schedule',
                name:'impTime'
            }, {
                boxLabel: 'Cost',
                name:'impCost'
            }, {
                boxLabel: 'Environment',
                name:'impEnvironment'
            }]
        }, {
            xtype: 'fieldcontainer',
            fieldLabel: 'Treatment Strategy',
            defaultType: 'checkboxfield',
            layout: {
                type: 'table',
                columns: 2,
                tdAttrs: {
                    style: {
                        width: 120
                    }
                }
            },
            defaults: {
                layout: '100%'
            },
            fieldDefaults: {
                msgTarget: 'under',
                labelAlign: 'right'
            },
            items: [
            {
                boxLabel: 'Avoidance',
                name:'treatmentAvoidance'
            }, {
                boxLabel: 'Reduction',
                name:'treatmentReduction'
            }, {
                boxLabel: 'Retention',
                name:'treatmentRetention'
            }, {
                boxLabel: 'Transfer/Sharing',
                name:'treatmentTransfer'
            }]
        }, {
            xtype: 'combobox',
            forceSelection: true,
            id:'qrmID-RiskEditorPrimCat',
            displayField: 'description',
            valueField: 'internalID',
            name:'primCatID',
            fieldLabel: 'Primary Category',
            queryMode: 'local'
        }, {
            xtype: 'combobox',
            forceSelection: false,
            id:'qrmID-RiskEditorSecCat',
            displayField: 'description',
            valueField: 'internalID',
            name:'secCatID',
            fieldLabel: 'Secondary Category',
            queryMode: 'local'
        }, {
            xtype: 'textfield',
            fieldLabel: 'Estimated Contingency',
            name:'estimatedContingencey'
        }, {
            xtype: 'fieldcontainer',
            defaultType: 'checkboxfield',
            hideEmptyLabel: false,
            defaults: {
                layout: '100%'
            },
            fieldDefaults: {
                msgTarget: 'under',
                labelAlign: 'right'
            },
            items: [
            {
                xtype: 'checkboxfield',
                boxLabel: 'Use Calculated Contingency',
                name:'useCalculatedContingency'
            }, {
                xtype: 'checkboxfield',
                boxLabel: 'Treated',
                name:'treated'
            }, {
                xtype: 'checkboxfield',
                boxLabel: 'Summary Risk',
                name:'summaryRisk'
            }
            ]
        }, {
            xtype: 'radiogroup',
            id:'qrmID-RiskEditorSecurityRadioGroup',
            fieldLabel: 'Security Level',
            allowBlank:false,
            columns: 1,
            vertical: true,
            items: [{
                boxLabel: 'Public',
                name: 'securityLevel',
                inputValue: 0
            }, {
                boxLabel: 'Restricted',
                name: 'securityLevel',
                inputValue: 1
            }, {
                boxLabel: 'Private',
                name: 'securityLevel',
                inputValue: 2
            }]
        }
        ]
    }),
    Ext.create('Ext.form.Panel', {
       id:'qrm-RiskEditorDataForm1',
       trackResetOnLoad:true,
        border: false,
        flex: 1,
        fieldDefaults: {
            labelAlign: 'top',
            enableKeyEvents: true
        },
        layout: {
            type: 'vbox',
            align: 'stretch' // Child items are stretched to full width
        },
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Title',
            afterLabelTextTpl: required,
            name:'title',
            allowBlank: false
        }, {
            xtype: 'textarea',
            fieldLabel: 'Description',
            afterLabelTextTpl: required,
            name:'description',
            flex: 1,
            allowBlank: false
        }, {
            xtype: 'textarea',
            fieldLabel: 'Consequences',
            name:'consequences',
            afterLabelTextTpl: required,
            flex: 1,
            allowBlank: false
        }, {
            xtype: 'textarea',
            fieldLabel: 'Possible Causes',
            name:'cause',
            afterLabelTextTpl: required,
            flex: 1,
            allowBlank: false
        }, {
            xtype: 'textarea',
            fieldLabel: 'Area Affected',
            name:'impact',
            flex: 1
        }

        ]
    })
    ]
});