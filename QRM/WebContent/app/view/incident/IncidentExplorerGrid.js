
Ext.define('QRM.view.incident.IncidentExplorerGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'qrm-incidentexplorer-grid',
    collapsible: false,
    multiSelect: false,
    store:'Incident',
    width:'100%',
    features: [{
       ftype: 'grouping',
       groupHeaderTpl: [
           '{name:this.formatName} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})', {
           formatName: function (name) {
               switch (name) {
                   case true:
                       return "Issues";
                       break;
                   case false:
                       return "Incidents";
                       break;
               }
           }
       }],
       hideGroupedHeader: false,
       startCollapsed: false,
       id: 'taskGrouping'
   }],
   columns : [
               {
                  text:'Code',
                  width:85,
                  dataIndex:'incidentProjectCode'
               }, {
                  text:'Severity',
                  width:80,
                  align:'center',
                  dataIndex:'severity',
                  renderer: function (value, metaData, record, row, col, store, gridView) {
                     return "<img src='/images/tol"+value+".png'></img>";
                  }
               },{
                  text:"Issue or Incident",
                  width:120,
                  align:'center',
                  dataIndex:'bIssue',
                  renderer: function (value, metaData, record, row, col, store, gridView) {
                        return (value)?"Issue":"Incident";
                  }
               }, {
                  text:'Title',
                  flex :1,
                  dataIndex:'title'
               },{
                  text: 'Reported By',
                  align: 'center',
                  width:150,
                  dataIndex : 'reportedByStr'
               } ,{
                  text: 'Date',
                  align: 'center',
                  width:130,
                  dataIndex : 'dateIncident',
                  renderer:Ext.util.Format.dateRenderer('d M Y'),
               }    
    ],
    dockedItems: [{
       xtype: 'toolbar',
       dock: 'bottom',
       ui: 'footer',
       items: [
               { xtype: 'component', flex: 1 },
               { 
                  text:'Edit', 
                  width:100,
                  handler:function(){
                     //
                  }
               },
               { 
                  text:'Delete', 
                  width:100,
                  handler:function(){
                     //
                  }
               },
               { 
                  text:'New Issue', 
                  width:100,
                  handler:function(){
                     //
                  }
               },
               { 
                  text:'New Incident', 
                  width:100,
                  handler:function(){
                     //
                  }
               }
               ]
    }],
}); 