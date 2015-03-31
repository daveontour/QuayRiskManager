Ext.define('QRM.view.explorer.RiskExplorerGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'qrm-explorer-grid',
    collapsible: false,
    multiSelect: true,
    store:'Explorer',
    width:'100%',
    columns:[{
       text: 'Risk Code',
       width: 85,
       dataIndex: 'riskProjectCode',
       locked: true,
       tdCls: 'x-change-cell',
       renderer: function (value, metaData, model, row, col, store, gridView) {
           var record = model.data;
           if (record.summaryRisk && record.promotionCode != "-") {
               return value + "* (" + record.toProjCode + ")";
           } else if (record.promotionCode != "-") {
               return value + " (" + record.toProjCode + ")";
           } else if (record.summaryRisk) {
               return value + "*";
           } else {
               return value;
           }
       }
   }, {
       width: 50,
       align: 'center',
       locked: true,
       dataIndex: 'currentTolerance',
       renderer: function (value, metaData, record, row, col, store, gridView) {
           return "<img src='/images/tol" + value + ".png'></img>";
       }
   }, {
       text: 'Title',
       flex: 1,
       dataIndex: 'title'
   }, {
       text: 'Owner',
       align: 'center',
       width: 130,
       dataIndex: 'ownerName'
   }, {
       text: 'Manager',
       align: 'center',
       width: 130,
       dataIndex: 'manager1Name'
   }, {
       text: 'Treated',
       align: 'center',
       width: 70,
       dataIndex: 'treated',
       renderer: function (value, metaData, record, row, col, store, gridView) {
           if (value) {
               return "<img src='/images/tick.png'></img>";
           } else {
               return "<img src='/images/action_stop.gif'></img>";
           }
       }
   }],
    
    
    viewConfig: {
       getRowClass: function(record, index) {
          var tol = record.get('currentTolerance');
          return 'rank'+tol;

      } ,
      plugins: {
         ptype: 'gridviewdragdrop',
         enableDrop:false,
         ddGroup: 'explorerDD'
     },

    },
    dockedItems: [{
       dock: 'top',
       ui:'footer',
       xtype: 'toolbar',
       items: [
               { text:'Reset Filters', 
                  handler:function(){
                     if (qoQRM.selectedCellID != null && qoQRM.selectedCellClassName != null) {
                        document.getElementById(qoQRM.selectedCellID).className = qoQRM.selectedCellClassName;
                     }
                     QRM.app.getExplorerController().resetFilterBtnHandler(); 
                  }
               }, 
               '->',
               {
                  text: 'New Risk',
                  id:'qrmID-riskGridNewRiskBtn',
                  iconCls:'addRisk',
                  width:120
                     
              },
              {
                 text:"Delete Selected",
                 id:'qrmID-riskGridDeleteRiskBtn',
                 iconCls:'deleteRisk',
                 width:120
              },
              {
                 xtype:'splitbutton',
                 text:'Actions',
                 width:110,
                 menu:[
                     {text:'Monte Carlo Analysis', iconCls:'dice', id:'qrmID-riskGridMonteBtn'},
                     //handled by the AuditTab controller because it uses the same mechanism
                     {text:'Schedule Review', iconCls:'schedule', id:'qrmID-riskGridScheduleBtn'},
                     {text:'Associated with an Incident', iconCls:'associate'},
                     {text:'Export As', iconCls:'export', id:'qrmID-riskGridExportBtn',
                        menu:[
                               {text:'MS Excel', type:'EXCEL', iconCls:'bluedisk'},
                               {text:'XML', type:'XML',iconCls:'bluedisk'},
                               {text:'MS Project (XML)',type:'PROJECTXML', iconCls:'bluedisk'},
                               {text:'MS Project (MPX)', type:'PROJECTMPX',iconCls:'bluedisk'}
                            ]
                     },
                     "-",
                     {text:'Remove Promotion', iconCls:'uparrow', id:'qrmID-riskGridUnpromoteBtn'},
                     "-",
                     {text:'Import Risks From File', iconCls:'import', id:'qrmID-riskGridImportBtn'},
                     {text:'Update Project Contingency', id:'qrmID-riskGridProjectContingencyBtn'}
                     ]
              },
              {
                 xtype:'splitbutton',
                 text:'Reports',
                 width:110,
                 menu:[
                     {text:'Risk Register Reports', iconCls:'pdf'},
                     {text:'Repository Reports', iconCls:'pdf'},
                     {text:'Selected Risk Reports', iconCls:'pdf'}
                     ]
              }, {
                 text: 'Grid Configuration',
                 menu: {        
                     items: [
                         '<b class="menu-title">Choose a Grid Layout</b>',
                         {
                             text: 'Detail View',
                             checked: true,
                             group: 'theme',
                             id:'qrmID-explorerGridDetailViewBtn'
                               
                         }, {
                             text: 'Audit View',
                             checked: false,
                             group: 'theme',
                             id:'qrmID-explorerGridAuditViewBtn'

                         }, {
                             text: 'Summary Risk View',
                             checked: false,
                             group: 'theme',
                             id:'qrmID-explorerGridSummaryViewBtn'
                        }
                     ]
                 }
            }

       ]
   }]
}); 