/**
 * 
 */

Ext.define('QRM.view.calender.CalenderPanel', {
   xtype : 'qrm-calenderpanel',
   extend : "Ext.panel.Panel",
   border : false,
   layout : 'fit',
   items : [
            {
               xtype:'panel',
               id :'qrm-RiskCalenderPanel',
               html:"<div id = 'svgcalID'></div>" 
            }
         ]
});