Ext.define('QRM.view.rank.RankWindow', {
    xtype : 'qrm-rankWindow',
    extend : "Ext.panel.Panel",
    border : false,
    layout : 'fit',
    items : [
             {
               xtype:'panel',
               border: false,
               anchor: '100% 100%',
               id :'qrm-SubRankOuterPanel',
               header:false,
               layout: {
                  type:"vbox",
                  align:'stretch'
               },
               items:[
                      {
                      xtype:'panel',
                      border:false,
                      id :'qrm-SubRankPanel',
                      html:"<div id='subRankSVGDiv' style = 'overflow:auto'></div>",
                      flex:1
                      }
                      ]
             }
          ]
});