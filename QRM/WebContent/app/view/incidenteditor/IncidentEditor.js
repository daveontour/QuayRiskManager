/**
 * 
 */

Ext.define('QRM.view.incidenteditor.IncidentEditor', {
    xtype: 'qrmXType-incidentEditor',
    extend: "Ext.window.Window",
    id:'qrmID-IncidentEditorWindow',
    border: false,
    modal: true,
    draggable: false,
    closeAction: 'hide',
    height: "90%",
    width: "90%",
    layout: 'fit',
    items: [{
        xtype: 'tabpanel',
        id: 'qrm-RiskEditorTabPanelID',
        items: [{
            title: 'Issue',
            layout: 'border',
            id: 'issueDataTab',
            items: [{
                xtype: 'qrmXType-riskEditorData',
                region: 'center'
            }]
        }, {
            title: 'Impacted Risks',
            layout: 'border',
            id: 'issueImpactRiskTab',
            items: [{
                xtype: 'qrmXType-riskEditorProb',
                region: 'center'
            }]
        }, {
            title: 'Impacted Objectives',
            layout: 'border',
            id: 'issueObjectiveTab',
            items: [{
                xtype: 'qrmXType-incidentEditorObjective',
                region: 'center'
            }]
        }, {
            title: 'Resolution Disposition',
            layout: 'border',
            id: 'issueResolutionTab',
            items: [{
                xtype: 'qrmXType-riskEditorStakeholder',
                region: 'center'
            }]
        }, {
            title: 'Attachments',
            layout: 'border',
            id: 'issueAttachmentTab',
            items: [{
                xtype: 'qrmXType-incidentEditorAttachment',
                region: 'center'
            }]
        }
        ]
    }]
});