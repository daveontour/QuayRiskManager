/**
 * 
 */



Ext.define('QRM.view.explorer.ContingencyWindow', {
    extend: "Ext.window.Window",
    title: 'Update Project Contingency',
    border: false,
    modal: true,
    draggable: false,
    closeAction: 'hide',
    height: 150,
    width: 350,
    fromGrid:false,
    layout: 'vbox',
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
                QRM.app.getExplorerController().contingencyWindow.close();
            }
        }, {
            text: 'Update',
            width: 110,
            id: 'qrmID-submitContingencyBtn'
        }]
    }],
    items: [
    Ext.create('Ext.form.Panel', {
        id: 'qrmID-contingencyConfigForm',
        width: '100%',
        trackResetOnLoad: true,
        border: false,
        hideEmptyLabel: false,
        layout: {
            type: 'vbox',
            padding: '5 5 5 5'
        },
        items: [ {
            xtype: "numberfield",
            name:'percentile',
            id:'qrmID-riskGridContingencyPercentileBtn',
            fieldLabel: 'Percentile',
            minValue:1,
            maxValue:100,
            value:80,
            width:200
        },{
           html:"<center><em>Updating the contingency may take a few<br/> minutes and will be done in the background</em></center>",
           border:false
        }
        ]
    })]
});

