/**
 * 
 */

Ext.define('QRM.store.Review', {
   extend : 'Ext.data.Store',
   storeId:'ReviewStore',
   fields: [
            {name: 'reviewID', type:'int'},     
            {name: 'title',   type: 'string'},
            {name: 'scheduledDate', type:'date'},
            {name: 'actualDate', type:'date'},        
            {name: 'reviewComplete', type:'boolean'}
        ],
   sorters:[
            { property:'scheduledDate', direction:'DESC' }
            ],
   groupField:'reviewComplete',
   proxy : {
      type : 'ajax',
      url : '/getAllReviews',
      reader : {
         type : 'json'
      }
   }
});

