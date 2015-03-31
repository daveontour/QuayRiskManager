/**
 * 
 */

Ext.define('QRM.store.RiskTree', {
    extend: 'Ext.data.TreeStore',
    storeId: 'qrm-RiskTreeStore',
    autoLoad:false,
    fields: [
             {name: 'riskProjectCode',  type: 'string'},
             {name: 'title',   type: 'string'},
             {name: 'ownerName', type:'string'},
             {name: 'manager1Name', type:'string'},        
             {name: 'treated', type:'boolean'},        
             {name:'currentTolerance', type: 'int'},
             {name: 'riskProjectCode',  type: 'string'},
             {name: 'riskID',   type: 'int'},
             {name: 'description',   type: 'string'},
             {name: 'riskCode',  type: 'string'},
             {name: 'riskTitle',  type: 'string'},
             {name: 'riskShortTitle',  type: 'string'},
             {name:'parentSummaryRisk', type: 'int'},
             {name:'origParentSummaryRisk', type: 'int'},
             {name:'forceDownParent', type: 'boolean'},
             {name:'summaryRisk', type: 'boolean'},
             {name:'tempIndex', type: 'int'},
             {name:'relationshipID', type: 'int'}
          ]
/*
 * Don't define a proxy until the tab is selected, so tree isn't loaded until needed.
 */
});
