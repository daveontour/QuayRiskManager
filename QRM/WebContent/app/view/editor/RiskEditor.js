/**
 * 
 */

Ext.define('QRM.view.editor.RiskEditor', {
    xtype: 'qrmXType-riskEditor',
    extend: "Ext.window.Window",
    id:'qrm-RiskEditorWindowID',
    border: false,
    modal: true,
    draggable: false,
    closeAction: 'hide',
    height: "90%",
    width: "90%",
    layout: 'fit',
    constructor:function(config){
       this.addEvents({
           "riskChanges" : true,
           "riskEditorClose" : true
       });
       
       this.listeners = config.listeners;
       this.callParent(arguments);      
    },
    items: [{
        xtype: 'tabpanel',
        id: 'qrm-RiskEditorTabPanelID',
        items: [{
            title: 'Risk Data',
            layout: 'border',
            id: 'editorRiskDataTab',
            items: [{
                xtype: 'qrmXType-riskEditorData',
                region: 'center'
            }]
        }, {
            title: 'Probability & Impact',
            layout: 'border',
            id: 'editorProbTab',
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
                   id: 'qrmID-RiskEditorCancelBtn2'
               }, {
                   text: 'Save Changes',
                   width: 110,
                   id: 'qrmID-RiskEditorSaveBtn2'
               }]
           }],
            items: [{
                xtype: 'qrmXType-riskEditorProb',
                region: 'center'
            }]
        }, {
            title: 'Mitigation',
            layout: 'border',
            id: 'editorMitigationTab',
            items: [{
                xtype: 'qrmXType-riskEditorMitigation',
                region: 'center'
            }]
        }, {
            title: 'Contributing Stakeholders',
            layout: 'border',
            id: 'editorStakeHoldersTab',
            items: [{
                xtype: 'qrmXType-riskEditorStakeholder',
                region: 'center'
            }]
        }, {
            title: 'Status Updates',
            layout: 'border',
            id: 'editorUpdatesTab',
            items: [{
                xtype: 'qrmXType-riskEditorStatus',
                region: 'center'
            }]
        }, {
            title: 'Response Plan',
            layout: 'border',
            id: 'editorResponseTab',
            items: [{
                xtype: 'qrmXType-riskEditorResponse',
                region: 'center'
            }]
        }, {
            title: 'Consequences',
            layout: 'border',
            id: 'editorConsequencesTab',
            items: [{
                xtype: 'qrmXType-riskEditorConsequence',
                region: 'center'
            }]
        }, {
            title: 'Controls',
            layout: 'border',
            id: 'editorControlTab',
            items: [{
                xtype: 'qrmXType-riskEditorControl',
                region: 'center'
            }]
        }, {
            title: 'Objectives',
            layout: 'border',
            id: 'editorObjectivesTab',
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
                   id: 'qrmID-RiskEditorCancelBtn4'
               }, {
                   text: 'Save Changes',
                   width: 110,
                   id: 'qrmID-RiskEditorSaveBtn4'
               }]
           }],
            items: [{
               xtype: 'qrmXType-riskEditorObjective',
               region: 'center'
           }]
        }, {
            title: 'Attachments',
            layout: 'border',
            id: 'editorAttachmentsTab',
            items: [{
                xtype: 'qrmXType-riskEditorAttachment',
                region: 'center'
            }]
        }, {
            title: 'Audit & Reviews',
            layout: 'border',
            id: 'editorAuditTab',
            items: [{
                xtype: 'qrmXType-riskEditorAudit',
                region: 'center'
            }]
        }
        ]
    }]
});