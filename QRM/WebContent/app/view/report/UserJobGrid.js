/**
 * 
 */

    Ext.define('QRM.view.report.UserJobGrid', {
        id: 'qrm-ReportStatusGrid',
        xtype:'qrm-userJobGrid',
        extend:'Ext.grid.Panel',
        region: 'center',
        collapsible: false,
        multiSelect: true,
        selType: 'checkboxmodel',
        store: 'UserJob',
        flex: 1,
        width: '100%',
        columns: [{
            text: 'Status',
            align:'center',
            width: 80,
            renderer: function (value, metaData, model, row, col, store, gridView) {

               var record = model.data;
                             
               if (record.failed) {
                  return "Failed";
               } else if ((record.readyToCollect || record.collected) && record.jobDescription.indexOf("(Excel)") != -1){
                  return "<a href = './report?action=download&format=xlsx&jobID=" + record.jobID + "' >Download</a>";
               }  else if ((record.readyToCollect || record.collected) && record.downloadOnly) {
                  return "<a href = './QRMAttachment?getJobResult=true&JOBID=" + record.jobID + "' >Download</a>";
               } else if (record.readyToCollect || record.collected) {
                  return "<a href = './QRMReportWindow.jsp?jobID=" + record.jobID + "' onclick=\"openReport("+record.jobID+");return false;\">Ready</a>";
               } else if (record.processing) {
                  return "Processing";
               } else if (record.readyToExecute || (!record.processing && !record.readyToExecute)) {
                  return "Queued";
               }
            }

        }, {
            text: 'Job ID',
            width: 80,
            align:'center',
            dataIndex: "jobID"
        }, {
            text: 'Description',
            flex: 1,
            dataIndex: 'jobDescription'
        }, {
            text: 'Queued Date',
            align:'center',
            dataIndex:'queuedDate',
            renderer:Ext.util.Format.dateRenderer('d M Y, H:i:s'),
            width: 200
        }, {
            text: 'Completed Date',
            align:'center',
            dataIndex:'executedDate',
            renderer:Ext.util.Format.dateRenderer('d M Y, H:i:s'),
            width: 200
        }



        ],
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
                id: 'qrm-ReportDeleteUserJobBtn'
            }, {
                text: 'Refresh',
                width:110,
                id: 'qrm-ReportRefreshJobsBtn'
            }]
        }],
    });

