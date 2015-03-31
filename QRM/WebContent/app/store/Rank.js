/**
 * 
 */

Ext.define('QRM.store.Rank', {
   extend : 'Ext.data.Store',
   storeId:'RankStore',
   model : 'QRM.model.LiteRisk',
   proxy : {
        type : 'rest',
        url : '/getRiskLiteFetchSortedXML',
        reader : {
            type : 'xml',
            root:'response',
            record:'record'
        }
   }
});

