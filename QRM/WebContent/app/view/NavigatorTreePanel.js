/**
 * 
 */

Ext.define('QRM.view.NavigatorTreePanel', {
   extend: 'Ext.tree.Panel',
   xtype: 'qrm-navigator-tree',
   autoScroll: true,
   id:"qrmNavigatorID",
   header: false,
   border: false,
   iconCls: 'nav',
   rootVisible : false,
   displayField : 'displayTitle',
   store: 'Navigator',
   viewConfig: {
      plugins: {
          ptype: 'treeviewdragdrop',
          ddGroup:'explorerDD',
          nodeHighlightOnDrop:true
      },
      listeners: {
         // Moving or promoting a risk from the Risk Explorer
         beforedrop: function(node, data, dropRec, dropPosition, dropHandlers) { 
            
            var parentProject = dropRec.data;
            var riskIDs = new Array();
            Ext.Array.each(data.records, function(item){
               riskIDs.push(item.data.riskID);
            });
            
            // Confirm intention
            dropHandlers.wait = true;
            Ext.MessageBox.show({
               title:"Risk Reassignment",
               msg:"Do you wish to 'Move' or 'Promote' the selected risks?",
               buttonText: {yes: "Move",no: "Promote",cancel: "Cancel"},               
               fn: function(btn){
                  if (btn == 'yes' || btn == 'no'){
                        Ext.Ajax.request({
                           url: "./reassignRisks",
                           params: {
                              "NEWPROJECTID": parentProject.projectID,
                              "MOVEORPROMOTE": (btn == 'yes')?0:1,
                              "XFERRISKS": JSON.stringify(riskIDs)
                           },
                           success: function (response) {
                              msgLeft("Risk Reassignment",response.responseText);
                              QRM.app.getExplorerController().populateGrid(QRM.global.projectID, Ext.getCmp('cbDescendants').value);
                           }
                        });
                      dropHandlers.cancelDrop();
                  }  else {
                     dropHandlers.cancelDrop();
                  }
               }
            });             
         },
         drop: function(node, data, dropRec, dropPosition) {
           // Handled already 
         }
     }
  }
});