/**
 * 
 */

Ext.define('QRM.store.Explorer', {
   extend : 'Ext.data.Store',
   model : 'QRM.model.LiteRisk',
   storeId:'LiteRiskStore',
   sortOnLoad:true,
   sorters:[
            { property:'currentTolerance', direction:'DESC' }
            ],
   proxy : {
      type : 'rest',
      url : '/getRiskLiteFetch',
      reader : {
         type : 'xml',
         root:'response',
         record:'record'
      }
   }
});

