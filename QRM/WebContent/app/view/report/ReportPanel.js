/**
 * 
 */

Ext.define('QRM.view.report.ReportPanel', {
    xtype: 'qrm-reportpanel',
    extend: "Ext.panel.Panel",
    border: false,
    layout: 'vbox',
    margin: '2 2 2 2',
    items: [{
        html: "<strong>Completed and Queued Reports</strong><br/><br/>",
        border: false
    },
{
       id: 'qrm-ReportStatusGrid',
       xtype:'qrm-userJobGrid'
      
}, {
        html: "<br/><strong>Scheduled Reports</strong><br/><br/>",
        border: false
    },

    Ext.create('Ext.grid.Panel', {
        id: 'qrm-ScheduledReportGrid',
        region: 'center',
        collapsible: false,
        multiSelect: false,
        flex: 1,
        width: '100%',
        columns: [{
            text: 'Tool',
            flex: 1,
            dataIndex: 'title'
        }],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            items: [{
                xtype: 'component',
                flex: 1
            }, {
                text: 'Delete',
                width:110,
                handler: function () {
                    alert('Export The Chart');
                }
            }, {
                text: 'New',
                width:110,
                handler: function () {
                    alert('Export The Chart');
                }
            }]
        }],
    })

    ]
});