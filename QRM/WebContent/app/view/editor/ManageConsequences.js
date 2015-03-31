/**
 * 
 */

Ext.define('QRM.view.editor.ManageConsequences', {
    extend: "Ext.window.Window",
    id: 'qrm-RiskEditorConsequenceEditorUpdateWindowID',
    border: false,
    modal: true,
    draggable: false,
    closeAction: 'hide',
    height: 700,
    width: 1000,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    align: 'stretch',
    padding: "5 5 5 5",
    items: [

    Ext.create('Ext.form.Panel', {
        border: false,
        id: 'qrm-RiskEditorConsequenceEditorUpdateWindowTopFormID',
        hideEmptyLabel: false,
        fieldDefaults: {
            labelAlign: 'right',
            labelWidth: 140,
            enableKeyEvents: true
        },
        layout: {
            type: 'vbox',
            padding: '10 20 30 10'
        },
        items: [
                {
                   xtype:"hiddenfield",
                   name:"internalID"
                },
                {
            xtype: 'textfield',
            fieldLabel: 'Consequences',
            width: 750,
            name: 'description'
        }, {
            xtype: 'combobox',
            width: 600,
            fieldLabel: 'Consequence Type',
            forceSelection: true,
            displayField: 'description',
            name: 'quantType',
            valueField: 'typeID',
            allowBlank: true,
            queryMode: 'local',
            store: quantTypeStore
        }]
    }),
    {
        html: "<strong>Pre Mitigation</strong>",
        border: false
    }, {
        xtype: 'panel',
        border: false,
        flex: 1,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: "qrmXType-ConsequenceWidget",
            border: false,
            preMit: true,
            imgID: 'qrm-PreMitConsequenceImageID',
            id: 'qrm-MitConsequenceID'
        }, {
            xtype: 'panel',
            border: false,
            id: 'qrm-PreMitConsequenceImageID',
            flex: 1
        }]
    }, {
        html: "<strong>Post Mitigation</strong>",
        border: false
    }, {
        xtype: 'panel',
        border: false,
        flex: 1,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: "qrmXType-ConsequenceWidget",
            border: false,
            preMit: false,
            imgID: 'qrm-PostMitConsequenceImageID',
            id: 'qrm-PostMitConsequenceID'
        }, {
            xtype: 'panel',
            border: false,
            id: 'qrm-PostMitConsequenceImageID',
            flex: 1
        }]
    }],
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        ui: 'footer',
        items: [{
            xtype: 'component',
            flex: 1
        }, {
           //handlers in the Consequnce Widget Controller
            text: 'Save',
            width: 110,
            id:"qrm-SaveConsequcesBtnID"
        }, {
            text: 'Cancel',
            width: 110,
            id:"qrm-CancelConsequcesBtnID"
        }]
    }]
});