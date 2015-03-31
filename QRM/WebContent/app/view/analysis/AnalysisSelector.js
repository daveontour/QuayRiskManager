/**
 * 
 */

Ext.define('QRM.view.analysis.AnalysisSelector', {
    xtype: 'qrm-analysisSelector',
    extend: "Ext.panel.Panel",
    border: false,
    layout: 'border',
    items: [
    Ext.create('Ext.grid.Panel', {
       id:'qrm-AnalysisSelectorGrid',
        region: 'center',
        collapsible: false,
        multiSelect: false,
        store:analysisToolStore,
        width: '100%',
        columns: [{
            text: 'Tool',
            flex:1,
            dataIndex: 'name'
        }]
    }), {
        xtype: 'panel',
        region: 'south',
        id:'qrm-AnalysisSelectorConfig',
        layout: 'vbox',
        border: false,
        height: 250,
        items: [

        Ext.create('Ext.form.Panel', {
            border: false,
            margin:5,
            items: [{
                xtype: 'fieldcontainer',
                margins: '15 0 0 0',
                layout: 'anchor',
                defaults: {
                    layout: '100%'
                },
                fieldDefaults: {
                    labelWidth: 100,
                    anchor: '100%'
                },
                items: [{
                    xtype: 'numberfield',
                    id: 'numAnalRecords',
                    fieldLabel: "# of Records",
                    minValue: 5,
                    maxValue: 100,
                    value: 30,
                    step: 1,
                    width:175
                }]
            }, {
                xtype: 'fieldcontainer',
                margins: '15 0 0 0',
                width: 140,
                defaultType: 'checkboxfield',
                layout: 'anchor',
                defaults: {
                    layout: '90%'
                },
                items: [ {
                    boxLabel: 'Reverse Sort',
                    checked: false,
                    id: 'cbAnalReverse'
                }]
            }]
        })]
    }]
});