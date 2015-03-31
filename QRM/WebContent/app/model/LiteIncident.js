/**
 * 
 */

Ext.define('QRM.model.LiteIncident', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'incidentProjectCode',  type: 'string'},
        {name: 'severity',   type: 'int'},
        {name: 'bIssue', type:'boolean'},
        {name: 'title', type:'string'},        
        {name: 'reportedByStr', type:'string'},        
        {name:'dateIncident', type: 'date'},
        {name:'incidentID', type:'int'}
    ]
});