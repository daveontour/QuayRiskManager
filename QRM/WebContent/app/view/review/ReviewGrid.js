Ext.define('QRM.view.review.ReviewGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'qrm-review-grid',
    collapsible: false,
    multiSelect: true,
    store: 'Review',
    height: '100%',
    width: '100%',
    features: [{
       ftype: 'grouping',
       groupHeaderTpl: [
           '{name:this.formatName} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})', {
           formatName: function (name) {
               switch (name) {
                   case true:
                       return "Completed";
                       break;
                   case false:
                       return "Outstanding";
                       break;
               }
           }
       }],
       hideGroupedHeader: false,
       startCollapsed: false,
       id: 'taskGrouping'
   }],
    columns: [{
        text: 'Review',
        flex: 1,
        dataIndex: 'title'
    }, {
        text: 'Scheduled Date',
        align: 'center',
        width: 130,
        renderer:Ext.util.Format.dateRenderer('d M Y'),
        dataIndex: 'scheduledDate'
    }, {
        text: 'Actual Date',
        align: 'center',
        width: 130,
        renderer:Ext.util.Format.dateRenderer('d M Y'),
        dataIndex: 'actualDate'
    }, {
        text: 'Complete',
        align: 'center',
        width: 90,
        dataIndex: 'reviewComplete'
    }],
    dockedItems: [
                  {
                     xtype: 'toolbar',
                     dock: 'top',
                     ui: 'header',
                     items: [{
                         xtype: 'component',
                         flex: 1
                     },{
                         xtype:'textfield',
                         id:'reviewRiskSearchCode',
                         emptyText:'Risk Code'
                     },
                     {
                        text:'Find',
                        width:100,
                        handler:function(){
                           QRM.app.getReviewController().populateGridRiskSearch();
                        }
                        
                     },
                     {
                        text:'Clear Filter',
                        width:100,
                        handler:function(){
                           Ext.getCmp('reviewRiskSearchCode').setValue("");
                           QRM.app.getReviewController().populateGrid();
                        }
                     }
                   ]
                 },
       {
        xtype: 'toolbar',
        dock: 'bottom',
        ui: 'footer',
        items: [{
            xtype: 'component',
            flex: 1
        }, {
            text: 'Edit',
            width: 110,
            handler: function () {
                //
            }
        }, {
            text: 'Delete',
            width: 110,
            handler: function () {
                //
            }
        }, {
            text: 'New Review',
            width: 110,
            handler: function () {
                //
            }
        } 
      ]
    }]
}); 