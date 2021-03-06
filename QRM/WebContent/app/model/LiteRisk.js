/**
 * 
 */

Ext.define('QRM.model.LiteRisk', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'riskProjectCode',  type: 'string'},
        {name: 'title',   type: 'string'},
        {name: 'ownerName', type:'string'},
        {name: 'mitPlanSummary', type:'string'},
        {name: 'mitPlanSummaryUpdate', type:'string'},
        {name: 'manager1Name', type:'string'},
        {name: 'startExposure', type:'date'},
        {name: 'endExposure', type:'date'},
        {name: 'manager1ID', type:'int'},        
        {name: 'ownerID', type:'int'},        
        {name: 'treated', type:'boolean'},        
        {name: 'securityLevel', type:'int'},        
        {name:'currentTolerance', type: 'int'},
        {name: 'riskProjectCode',  type: 'string'},
        {name: 'riskID',   type: 'int'},
        {name: 'primCatID',   type: 'int'},
        {name: 'secCatID',   type: 'int'},
        {name: 'description',   type: 'string'},
        {name: 'cause',   type: 'string'},
        {name: 'consequences',   type: 'string'},
        {name: 'impact',   type: 'string'},
        {name: 'summaryRisk',   type: 'boolean'},
        {name: 'impEnvironment',   type: 'boolean'},
        {name: 'impReputation',   type: 'boolean'},
        {name: 'impSafety',   type: 'boolean'},
        {name: 'impSpec',   type: 'boolean'},
        {name: 'impTime',   type: 'boolean'},
        {name: 'impCost',   type: 'boolean'},
        {name: 'treatmentAvoidance',   type: 'boolean'},
        {name: 'treatmentReduction',   type: 'boolean'},
        {name: 'treatmentRetention',   type: 'boolean'},
        {name: 'treatmentTransfer',   type: 'boolean'},
        {name: 'useCalculatedContingency',   type: 'boolean'},
        {name: 'liketype',   type: 'int'},
        {name: 'likealpha',   type: 'float'},
        {name: 'liket',   type: 'int'},
        {name: 'likepostType',   type: 'int'},
        {name: 'likepostAlpha',   type: 'float'},
        {name: 'likepostT',   type: 'int'},
        {name: 'useCalculatedProb',   type: 'boolean'},
        {name: 'estimatedContingencey',   type: 'float'},
        {name: 'treated',   type: 'boolean'},
        {name: 'riskCode',  type: 'string'},
        {name: 'riskTitle',  type: 'string'},
        {name: 'riskShortTitle',  type: 'string'},
        {name:'parentSummaryRisk', type: 'int'},
        {name:'origParentSummaryRisk', type: 'int'},
        {name:'tempIndex', type: 'int'},
        {name:'preMitContingency', type: 'float'},
        {name:'preMitContingencyWeighted', type: 'float'},
        {name:'postMitContingency', type: 'float'},
        {name:'postMitContingencyWeighted', type: 'float'},
        {name:'promotionCode', type: 'string'},
        {name:'toProjCode', type: 'string'},
        {name:'dateIDRev', type: 'date'},       
        {name:'dateIDApp', type: 'date'},       
        {name:'dateEvalRev', type: 'date'},       
        {name:'dateEvalApp', type: 'date'},       
        {name:'dateMitRev', type: 'date'},       
        {name:'dateMitApp', type: 'date'}       
     ]
});