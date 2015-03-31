Ext.define('QRM.view.summary.SummaryTree', {
   xtype : 'qrm-summaryRiskTree',
   extend: 'Ext.panel.Panel',
   autoScroll: true,
   id:"qrmSummaryRiskNavigatorID",
   html:"<svg id='relationshipTree'></svg>"
//   header: false,
//   iconCls: 'nav',
//   rootVisible : false,
//   store: 'RiskTree',
//   columns:[
//            {
//               xtype:'treecolumn',
//               text: "Summary and Propogated Risks",
//               flex:1,
//               dataIndex:'title',
//               tdCls : 'x-change-cell',
//               renderer: function (value, metaData, record, row, col, store, gridView) {
//                  if (record.raw.dirty || record.dirty){
//                     return "<span style='color:red'>"+record.data.riskProjectCode+" - "+value+"</span>";                     
//                  } else {
//                     return record.data.riskProjectCode+" - "+value;
//                  }
//               }
//            }
//            ],
//   viewConfig: {
//      getRowClass: function(record, index) {
//         //making use of existing style to highlight modified rows
//         if(record.raw.dirty || record.dirty){
//            return 'dirtyMove';
//         }
//     },
//      plugins: {
//          ptype: 'treeviewdragdrop',
//          ddGroup:'summRiskDD',
//          nodeHighlightOnDrop:true
//      },
//      listeners: {
//         itemmouseenter: function (view, record, item, index, e, eOpts) {
//            var data = record.data;
//            Ext.getCmp('qrmID-summaryPanelPropertyViewer').setSource({
//               "Risk Code":data.riskProjectCode,
//               "Title":data.title,
//               "Description":data.description,
//               "Owner":data.ownerName,
//               "Manager":data.manager1Name
//            });
//        },
//         beforedrop: function(node, data, dropRec, dropPosition, dropHandlers) { 
//            var rec = data.records[0];
//            var risk = rec.data;
//            
//            var parentRisk;
//            
//            if (dropRec.data.leaf){
//               parentRisk = dropRec.parentNode.data;
//            } else {
//               parentRisk = dropRec.data;
//            }
//            
//            // Don't allow Summary Risks or Propagated Risks to be moved            
//            if (data.view.xtype != 'gridview'){
//               if (!risk.leaf){
//                  Ext.Msg.alert('Summary and Propogated Risks', 'You cannot move a summary or top propogated risk');
//                  return false;
//               }
//            }            
//            // Check if the node already has a child by that name.           
//            var node = QRM.app.getStore('RiskTree').getRootNode().findChild('riskProjectCode', parentRisk.riskProjectCode).findChild('riskProjectCode', risk.riskProjectCode);
//            if (node != null){
//               Ext.Msg.alert('Summary and Propogated Risks', 'Relatioship already exists'); 
//               return false;
//            }
//            // Check for dropping on itself
//            if (parentRisk.riskProjectCode == risk.riskProjectCode){
//               Ext.Msg.alert('Summary and Propogated Risks', 'Cannot make a risk a child of itself'); 
//               return false;               
//            }
//            // Check if the dropped risk is a parent.           
//            var node = QRM.app.getStore('RiskTree').getRootNode().findChild('riskProjectCode', risk.riskProjectCode);
//            if (node != null){
//               Ext.Msg.alert('Summary and Propogated Risks', 'Risk '+risk.riskProjectCode+' is a Summary Risk and cannot be made a child of another summary risk'); 
//               return false;
//            }
//            // Check for dropping on Propagated Risk
//            if (parentRisk.riskProjectCode == risk.riskProjectCode){
//               Ext.Msg.alert('Summary and Propogated Risks', 'Cannot add risks to a propagated risk'); 
//               return false;               
//            }
//            // Check for moving a  propagated Risk
//            if (data.view.xtype != 'gridview'){
//               var parentNode = QRM.app.getStore('RiskTree').getRootNode().findChild('riskProjectCode', risk.riskProjectCode, true).parentNode;
//               if (parentNode.forceDownRisk){
//                  Ext.Msg.alert('Summary and Propogated Risks', 'Cannot move the child of a propagated risk'); 
//                  return false;                                 
//               }
//            }
//            // Check for 'before' position on a top node
//            if (!dropRec.data.leaf && dropPosition == 'before'){
//               Ext.Msg.alert('Summary and Propogated Risks', 'Cannot drop a risk before a summary risk'); 
//               return false;                                                
//            }
//            
//            // Confirm intention
//            dropHandlers.wait = true;
//            Ext.MessageBox.confirm('Assign Child Risk', 'Make risk '+risk.riskProjectCode+ ' a child risk of '+parentRisk.riskProjectCode+'? ', function(btn){
//                if (btn === 'yes') {
//                   risk.dirty = true;
//                   rec.dirty = true;
//                   risk.leaf = true;
//                   risk.parentSummaryRisk = parentRisk.riskID;
//                   risk.removeChild = 0;
//                   QRM.app.getSummaryRisksController().dirtyRecords.push(risk);
//                   dropHandlers.processDrop();
//                } else {
//                    dropHandlers.cancelDrop();
//                }
//            });
//                        
//         },
//         drop: function(node, data, dropRec, dropPosition) {
//           QRM.app.getSummaryRisksController().dirty = true; 
//         }
//     }
//  }
});