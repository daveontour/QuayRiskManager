/**
 * 
 */

Ext.define('QRM.store.Consequence', {
   extend : 'Ext.data.ArrayStore',
   storeId:'ConsequenceStore',
   fields: [
            {name: 'description', type:'string'},     
            {name: 'type',   type: 'string'},
            {name: 'costDistributionType', type:'string'},
            {name: 'riskConsequenceProb', type:'string'},        
            {name: 'treated', type:'boolean'}
        ]
});

