/**
 * 
 */

Ext.define('QRM.view.incidenteditor.ObjectiveTab', {
   xtype: 'qrmXType-incidentEditorObjective',
   extend: "Ext.panel.Panel",
   border: false,
   layout: {
      type: 'vbox',
      padding: '5 5 5 5',
      align: 'stretch' // Child items are stretched to full width
   },


   items: [
           Ext.create('Ext.tree.Panel', {
              autoScroll: true,
              id:"qrmID-IncidentEditorObjectiveTree",
              header: false,
              border:false,
              iconCls: 'nav',
              rootVisible : false,
              store:objectiveStore,
              columns:[
                       {
                          xtype:'treecolumn',
                          text: "Objectives Impacted by this Incident/Issue",
                          flex:1,
                          dataIndex:'objective'
                       }
                       ],
                       viewConfig: {
                          getRowClass: function(record, index) {
                           
                             var rtnVal = 'objectiveInActive';
                             Ext.Array.each(QRM.global.currentRisk.objectivesImpacted, function(x){
                                if (x == record.raw.objectiveID){
                                   rtnVal = 'objectiveActive';
                                   return false;
                                }
                             });
                             return rtnVal;

                         }
                       },
                       listeners: {
                          itemclick: function (view, record, item, row, e, eOpts) {
                             
                             riskEditorDirty = true;
                             var index = QRM.global.currentRisk.objectivesImpacted.indexOf(record.raw.objectiveID);
                             
                             if (index > -1) {
                                view.removeRowCls(row,'objectiveActive');
                                view.addRowCls(row,'objectiveInActive');
                                QRM.global.currentRisk.objectivesImpacted.splice(index, 1);
                            } else {
                               QRM.global.currentRisk.objectivesImpacted.push(record.raw.objectiveID);
                               view.removeRowCls(row,'objectiveInActive');
                               view.addRowCls(row,'objectiveActive');
                            }
                          }}
           })
           ]
});