/**
 * 
 */

Ext.define('QRM.view.explorer.ImportRiskFileWindow', {
    extend: "Ext.window.Window",
    title: 'Import Risk File',
    border: false,
    modal: true,
    draggable: true,
    closeAction: 'hide',
    height: 250,
    width: 600,
    fromGrid: false,
    layout: 'border',
    align: 'stretch',
    padding: '0 0 0 0',
    items: [{
        html: "<strong>Importing Risks</strong><br/><br/>Select the file containig the risk. After the file has been uploaded, you will be prompted to select the specific risks you wish to import.<br/><br/>The selected file must either be in QRM XML format or CSV format<br/><br/>",
        padding: '5 5 5 5',
        region: 'north',
        border: false,
        style: {
           backgroundColor:'white'
       }

    },
    Ext.create('Ext.form.Panel', {
       style: {
          backgroundColor:'white'
      },
        border: false,
        padding: '5 5 5 5',
        region: 'center',
        id: 'qrmID-ImportRiskFileSelectForm',
        defaults: {
            anchor: '100%',
            msgTarget: 'side',
            labelWidth: 80
        },
        items: [{
            width: '100%',
            xtype: 'filefield',
            allowBlank: false,
            labelAlign: 'right',
            emptyText: 'Select an risk file to import',
            fieldLabel: 'Risk File'
        }]
    })],
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        ui: 'footer',
        items: [
            "->", {
            text: 'Cancel',
            width: 110,
            handler: function () {
                QRM.app.getExplorerController().importRiskFileWindow.close();
            }
        }, {
            text: 'Upload',
            width: 110,
            id: 'qrmID-ImportRiskFileUploadBtn',
            handler: function () {
                var form = $$('qrmID-ImportRiskFileSelectForm').getForm();
                if (form.isValid()) {
                    form.submit({
                        url: './importRisk?uploadRisks=true',
                        waitMsg: 'Uploading risk file...',
                        success: function (fp, action) {
                            QRM.app.getExplorerController().importRiskFileWindow.close();
                            QRM.app.getExplorerController().chooseImportRisks(Ext.decode(action.response.responseText));
                        },
                        failure: function (fp, action) {
                           msg("Risk File Import", "Error uploading the selected file");
                           QRM.app.getExplorerController().importRiskFileWindow.close();
                        }
                    });
                }
            }

        }]
    }]
});
