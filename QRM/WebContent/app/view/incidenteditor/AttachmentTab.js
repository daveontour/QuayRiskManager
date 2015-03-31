/**
 * 
 */

function qrmLoadAttachmentStore() {
    attachmentStore.load({
        params: {
            "RISKID": QRM.global.currentRisk.riskID,
            "PROJECTID": QRM.global.projectID
        }
    });
}

function handleDeleteAttachment() {
    Ext.Msg.show({
        title: 'Remove Attachment',
        msg: '<center>Delete Selected Attachments?</center>',
        width: 400,
        buttons: Ext.Msg.YESNO,
        icon: Ext.Msg.QUESTION,
        fn: function (btn) {
            if (btn == "yes") {
                var selection = $$('qrmID-RiskEditorAttachmentGrid').getSelectionModel().getSelection();
                var selectionIDS = selection.getDataProperty("internalID");
                Ext.Ajax.request({
                    url: "./removeAttachments",
                    params: {
                        "RISKID": QRM.global.currentRisk.riskID,
                        "DATA": Ext.encode(selectionIDS),
                        "PROJECTID": QRM.global.projectID,
                        "EXT": true
                    },
                    success: function (response) {
                        var risk = Ext.decode(response.responseText);
                        if (risk) {
                            msg('Remove Attachment', 'Attachment Removed');
                        } else {
                            msg('Remove Attachment', 'You are not authorised to remove attachment');
                        }

                        qrmLoadAttachmentStore();
                    },
                    failure: function () {
                        msg('Remove Attachment', 'Error removing selected attachments');
                        qrmLoadAttachmentStore();
                    }
                });
            }
        }
    });
}
Ext.define('QRM.view.incidenteditor.AttachmentTab', {
    xtype: 'qrmXType-incidentEditorAttachment',
    extend: "Ext.panel.Panel",
    border: false,
    layout: {
        type: 'vbox',
        padding: '0 0 0 0',
        align: 'stretch' // Child items are stretched to full width
    },
    items: [{
        xtype: 'panel',
        border:false,
        flex: 1,
        layout: {
            type: 'vbox',
            padding: '5 5 5 5',
            align: 'stretch' // Child items are stretched to full width
        },
        items: [{
            html: "<strong>Incident/Issue Attachments</strong><br/><br/>",
            border: false
        },

        Ext.create('Ext.grid.Panel', {
            id: 'qrmID-IncidentEditorAttachmentGrid',
            collapsible: false,
            multiSelect: true,
            store: attachmentStore,
            selType: 'checkboxmodel',
            flex: 1,
            width: '100%',
            columns: [{
                text: 'Description',
                align: 'left',
                tdCls: 'wrap-text',
                dataIndex: 'description',
                flex: 1,
                renderer: function (value, metaData, model, row, col, store, gridView) {
                   var record = model.raw;
                   if (record.attachmentURL) {
                       return "<img src='/images/Attach.png'/>&nbsp;&nbsp;<a href = '" + record.attachmentURL + "' target='_blank'>"+value+"</a>";
                   } else {
                       return "<img src='/images/Link.png'/>&nbsp;&nbsp;<a href = '" + record.url + "' target='_blank'>"+value+"</a>";
                   }
                }
            }
            ],
            viewConfig: {
                emptyText: 'No Attachments Found'
            },
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
                    handler: handleDeleteAttachment
                }]
            }],
        })]
    },

    {
        xtype: 'panel',
        height: 200,
        border: false,
        layout: {
            type: 'hbox',
            padding: '5 5 5 5',
            align: 'stretch' // Child items are stretched to full width
        },
        items: [
        Ext.create('Ext.form.Panel', {
            flex: 1,
            frame: true,
            title: 'New File Attachment',
            bodyPadding: '10 10 0',

            defaults: {
                anchor: '100%',
                allowBlank: true,
                msgTarget: 'side',
                labelWidth: 120
            },

            items: [{
                xtype: 'textarea',
                height: 70,
                name: 'description',
                fieldLabel: 'Description'
            }, {
                xtype: 'filefield',
                emptyText: 'Select an attachment',
                fieldLabel: 'Attachment',
                buttonConfig: {
                    iconCls: 'upload-icon'
                }
            }, {
                xtype: 'hidden',
                name: 'hostID'
            }, {
                xtype: 'hidden',
                name: 'hostType'
            }],

            buttons: [{
                text: 'Save',
                handler: function () {
                    var form = this.up('form').getForm();
                    form.findField('hostID').setValue(QRM.global.currentRisk.riskID);
                    form.findField('hostType').setValue("RISK");
                    if (form.isValid()) {
                        form.submit({
                            url: '/QRMAttachment?saveAttachment=true',
                            waitMsg: 'Uploading attachment...',
                            success: function (fp, o) {
                                qrmLoadAttachmentStore();
                            },
                            failure: function (fp, o) {
                                qrmLoadAttachmentStore();
                            }
                        });
                    }
                }
            }]
        }),
        Ext.create('Ext.form.Panel', {
            flex: 1,
            frame: true,
            title: 'New URL Link',
            margin: '0 0 0 5',
            bodyPadding: '10 10 0',

            defaults: {
                anchor: '100%',
                allowBlank: true,
                msgTarget: 'side',
                labelWidth: 120
            },

            items: [{
                xtype: 'textarea',
                height: 70,
                name: 'description',
                fieldLabel: 'Description'
            }, {
                xtype: 'textfield',
                name: 'url',
                fieldLabel: 'URL'
            }, {
                xtype: 'hidden',
                name: 'hostID'
            }, {
                xtype: 'hidden',
                name: 'hostType'
            }],

            buttons: [{
                text: 'Save',
                handler: function () {
                    var form = this.up('form').getForm();
                    form.findField('hostID').setValue(QRM.global.currentRisk.riskID);
                    form.findField('hostType').setValue("RISK");
                    if (form.isValid()) {
                        form.submit({
                            url: '/QRMAttachment?saveAttachment=true',
                            waitMsg: 'Uploading attachment...',
                            success: function (fp, o) {
                                qrmLoadAttachmentStore();
                            },
                            failure: function (fp, o) {
                                qrmLoadAttachmentStore();
                            }
                        });
                    }
                }
            }]
        })]

    }]
});