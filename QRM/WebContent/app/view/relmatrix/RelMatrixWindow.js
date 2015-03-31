/**
 * 
 */

Ext.define('QRM.view.relmatrix.RelMatrixWindow', {
   xtype : 'qrm-relMatrixWindow',
   extend : "Ext.panel.Panel",
   id:"qrm-MatrixPanelID",
   border : false,
   layout : 'fit',
   items : [
            {
              xtype:'panel',
              border: false,
              anchor: '100% 100%',
              id :'qrm-RelMatrixOuterPanel',
              header:false,
              layout: {
                 type:"vbox",
                 align:'stretch'
              },
              items:[
                     {
                     xtype:'panel',
                     border:false,
                     id :'qrm-RelMatrixPanel',
                     html:"<div id='relMatrixSVGDiv'></div>",
                     flex:1
                     }
                     ]
            }
         ]
});