/**
 * 
 */

Ext.define('QRM.store.Incident', {
   extend : 'Ext.data.Store',
   fields: [
            {name: 'incidentProjectCode',  type: 'string'},
            {name: 'severity',   type: 'int'},
            {name: 'bIssue', type:'boolean'},
            {name: 'title', type:'string'},        
            {name: 'reportedByStr', type:'string'},        
            {name:'dateIncident', type: 'date'},
            {name:'incidentID', type:'int'}
        ],   storeId:'LiteIncidentStore',
   sorters:[
            { property:'dateIncident', direction:'DESC' }
            ],
   groupField:'bIssue',
   proxy : {
      type : 'rest',
      url : '/getAllIncidentsSummary',
      reader : {
         type : 'json',
      }
   },
   listeners: {
      load: function (store, node, records, successful) {
          if(node.length < 1){
             Ext.Msg.show({
                title: 'Incident and Issues',
                msg: 'No Incidents or Issues were found',
                width: 300,
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
          }
      }
  }
});

