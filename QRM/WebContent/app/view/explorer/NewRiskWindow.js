/**
 * 
 */



Ext.define('QRM.view.explorer.NewRiskWindow', {
    extend: "Ext.window.Window",
    title: 'New Risk',
    border: false,
    modal: true,
    draggable: false,
    closeAction: 'hide',
    height: 500,
    width: 1000,
    layout: 'hbox',
    align: 'stretch',
    padding: "0 0 0 0",
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        ui: 'footer',
        items: [
                "->",
                {
            text: 'Cancel',
            width: 110,
            handler: function () {
                QRM.app.getExplorerController().newRiskWindow.close();
            }
        }, {
            text: 'Submit',
            width: 110,
            id: 'qrmID-submitNewRiskBtn'
        }]
    }],
    items: [
            Ext.create('Ext.form.Panel', {
                id:'qrm-NewRiskEditorDataForm2',
                trackResetOnLoad:true,
                border: false,
                width: 350,
                height:"100%",
                hideEmptyLabel: false,
                fieldDefaults: {
                    labelAlign: 'right',
                    labelWidth: 140,
                    enableKeyEvents: true
                },
                layout: {
                    type: 'vbox',
                    padding: '15 20 5 5',
                    align: 'stretch' // Child items are stretched to full width
                },
                items: [{
                    xtype: 'combobox',
                    fieldLabel: 'Risk Owner',
                    forceSelection: true,
                    displayField: 'name',
                    id:'qrmID-NewRiskEditorRiskOwner',
                    store:projectOwnersStore,
                    name:'ownerID',
                    valueField: 'stakeholderID',
                    allowBlank: false,
                    queryMode: 'local'
                }, {
                    xtype: 'combobox',
                    fieldLabel: 'Risk Manager',
                    forceSelection: true,
                    displayField: 'name',
                    id:'qrmID-NewRiskEditorRiskManager',
                    store:projectManagersStore,
                    name:'manager1ID',
                    valueField: 'stakeholderID',
                    allowBlank: false,
                    queryMode: 'local'
                }, {
                    xtype: 'datefield',
                    name:'startExposure',
                    format:'d M Y',
                    allowBlank: false,
                    fieldLabel: 'Start of Exposure'
                }, {
                    xtype: 'datefield',
                    name:'endExposure',
                    format:'d M Y',
                    allowBlank: false,
                    fieldLabel: 'End of Exposure'
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
                        boxLabel: 'Summary Risk',
                        name:'summaryRisk',
                        id:"qrmID-NewRiskEditorSummaryRisk"
                    }, {
                        xtype: 'checkboxfield',
                        boxLabel: 'Propogated',
                        name:'forceDownRisk',
                        id:"qrmID-NewRiskEditorPropogatedRisk",
                        handler:function(){
                           $$('qrmID-NewRiskEditorPropogateTypeGroup').setDisabled(!this.value);
                        }
                    }
                    ]
                }, {
                   xtype: 'radiogroup',
                   id:'qrmID-NewRiskEditorPropogateTypeGroup',
                   fieldLabel: 'Propogate Risk To',
                   disabled:true,
                   allowBlank:false,
                   columns: 1,
                   vertical: true,
                   items: [{
                       boxLabel: 'Immediate Sub Projects',
                       name: 'typePropogation',
                       checked:true,
                       inputValue: 0
                   }, {
                       boxLabel: 'All Sub Projects',
                       name: 'typePropogation',
                       inputValue: 1
                   }]
               }
                ]
            }),
            Ext.create('Ext.form.Panel', {
               id:'qrm-NewRiskEditorDataForm1',
               trackResetOnLoad:true,
               height:"100%",
                border: false,
                flex: 1,
                fieldDefaults: {
                    labelAlign: 'top',
                    enableKeyEvents: true
                },
                layout: {
                    type: 'vbox',
                    padding: '0 10 10 5',
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
                }                ]
            })
            ]
});

