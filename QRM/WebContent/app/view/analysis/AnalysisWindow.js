/**
 * 
 */

Ext.define('QRM.view.analysis.AnalysisWindow', {
   xtype : 'qrm-analysisWindow',
   id: 'qrmID-analysisWindow',
   extend : "Ext.panel.Panel",
   border : false,
   layout : 'fit',
   items : [
            {
              xtype:'panel',
              border: false,
              anchor: '100% 100%',
              id :'qrm-RiskAnalysisPanel'
            }
         ]
});