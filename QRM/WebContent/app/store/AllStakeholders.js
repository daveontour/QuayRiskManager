/**
 * 
 */

Ext.define('QRM.store.AllStakeholders', {
   extend : 'Ext.data.Store',
   fields: [

{
   name: "name",
   type: "string"
}, {
   name: "email",
   type: "string"
}, {
   name: "stakeholderID",
   type: "string"
}, {
   name: "compoundName",
   type: "string"
}          
],
proxy: {
   type: 'ajax',
   url: '/getAllRiskStakeholdersDS',
   reader: {
      type: 'json'
   }
}
});