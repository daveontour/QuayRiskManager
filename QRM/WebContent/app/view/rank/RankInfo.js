/**
 * 
 */

Ext.define('QRM.view.rank.RankInfo', {
    xtype: 'qrm-rankInfo',
    extend: "Ext.panel.Panel",
    border: false,
    layout: 'border',
    items: [{
       id:'qrm-rankDetail',
       region:'center',
       border:false
    }]
});