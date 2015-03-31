/**
 * 
 */

Ext.define('QRM.view.incident.IncidentFilterPanel', {
    xtype: 'qrm-incidentfilterpanel',
    extend: "Ext.panel.Panel",
    border: false,
    animCollapse: true,
    collapsible: true,
    title: 'Incident and Issues Filters',
    layout: {
        type: 'hbox',
        align: 'top',
        defaultMargins: {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
        }
    },
    items: [

    Ext.create('Ext.form.Panel', {
        border: false,
        layout: 'vbox',
        width: 140,
        height: 185,

        items: [{
            xtype: 'fieldcontainer',
            margins: '0 0 0 15',
            fieldLabel: 'Severity',
            defaultType: 'checkboxfield',
            labelCls: 'field-container-label',
            width: 140,
            layout: 'anchor',
            defaults: {
                layout: '100%'
            },
            fieldDefaults: {
                msgTarget: 'under',
                labelAlign: 'top'
            },
            items: [

            {
                boxLabel: 'Extreme',
                checked: true,
                id: 'cbIncidentExtreme'
            }, {
                boxLabel: 'High',
                checked: true,
                id: 'cbIncidentHigh'
            }, {
                boxLabel: 'Significant',
                checked: true,
                id: 'cbIncidentSignificant'
            }, {
                boxLabel: 'Moderate',
                checked: true,
                id: 'cbIncidentModerate'
            }, {
                boxLabel: 'Low',
                checked: true,
                id: 'cbIncidentLow'
            }]
        }]
    }),

    Ext.create('Ext.form.Panel', {
        border: false,
        layout: 'vbox',
        width: 140,
        height: 185,

        items: [{
            xtype: 'fieldcontainer',
            margins: '0 0 0 0',
            fieldLabel: 'Areas of Impact',
            labelCls: 'field-container-label',
            width: 140,
            defaultType: 'checkboxfield',
            layout: 'anchor',
            defaults: {
                layout: '100%'
            },
            fieldDefaults: {
                msgTarget: 'under',
                checked: true,
                labelAlign: 'top'
            },
            items: [{
                boxLabel: 'Reputation',
                checked: true,
                id: 'cbIncidentReputation'
            }, {
                boxLabel: 'Human Safety',
                checked: true,
                id: 'cbIncidentSafety'
            }, {
                boxLabel: 'Specification',
                checked: true,
                id: 'cbIncidentSpecification'
            }, {
                boxLabel: 'Schedule',
                checked: true,
                id: 'cbIncidentSchedule'
            }, {
                boxLabel: 'Cost',
                checked: true,
                id: 'cbIncidentCost'
            }, {
                boxLabel: 'Environment',
                checked: true,
                id: 'cbIncidentEnviron'
            }]
        }]
    }),
    Ext.create('Ext.form.Panel', {
       border : false,
       items: [ 
       {
          xtype: 'fieldcontainer',
          margins :'0 0 0 0',
          fieldLabel: 'Impacted Risk Code',
          labelCls : 'field-container-label',
          layout: 'anchor',
          defaults: {
             layout: '100%'
          },
          fieldDefaults: {
             msgTarget: 'under',
             labelAlign: 'top'
          },
          items: [{
             xtype:'textfield',
             id :'txtIncidentRiskCode',
             enableKeyEvents:true,
          }
          ]
       },
       {
          xtype: 'fieldcontainer',
          margins :'0 0 0 0',
          fieldLabel: 'Incident or Issue Code',
          labelCls : 'field-container-label',
          layout: 'anchor',
          defaults: {
             layout: '100%'
          },
          fieldDefaults: {
             msgTarget: 'under',
             labelAlign: 'top'
          },
          items: [{
             xtype:'textfield',
             id :'txtIncidentIssueCode',
             enableKeyEvents:true,
          }
          ]
       }

       ]
    }),

    Ext.create('Ext.form.Panel', {
        border: false,
        layout: 'vbox',
        width: 140,
        height: 170,
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            style: {
                background: 'white'
            },
            items: [{
                xtype: 'component',
                flex: 1
            }, {
                text: 'Reset Filters',
                handler:function(){
                   QRM.app.getIncidentController().resetFilterPanel();
                }

            }]
        }],
        items: [{
            xtype: 'fieldcontainer',
            margins: '0 0 0 15',
            fieldLabel: 'Status',
            labelCls: 'field-container-label',
            width: 140,
            defaultType: 'checkboxfield',
            layout: 'anchor',
            defaults: {
                layout: '100%'
            },
            fieldDefaults: {
                msgTarget: 'under',
                checked: true,
                labelAlign: 'top'
            },
            items: [{
                boxLabel: 'Active',
                checked: true,
                id: 'cbIncidentActive'
            }, {
                boxLabel: 'Closed',
                checked: true,
                id: 'cbIncidentClosed'
            }]
        }]
    })

    ]
});