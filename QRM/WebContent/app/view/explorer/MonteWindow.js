/**
 * 
 */



Ext.define('QRM.view.explorer.MonteWindow', {
    extend: "Ext.window.Window",
    title: 'Monte Carlo Simulation Configuration',
    border: false,
    modal: true,
    draggable: false,
    closeAction: 'hide',
    height: 600,
    width: 800,
    fromGrid:false,
    layout: 'vbox',
    align: 'stretch',
    padding: "0 0 0 0",
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        ui: 'footer',
        items: [
                "->",
                {
            text: 'Cancel',
            width: 110,
            handler: function () {
                QRM.app.getExplorerController().monteWindow.close();
            }
        }, {
            text: 'Submit',
            width: 110,
            id: 'qrmID-submitMonteBtn'
        }]
    }],
    items: [
    Ext.create('Ext.form.Panel', {
        id: 'qrmID-monteConfigForm',
        width: '100%',
        height:200,
        trackResetOnLoad: true,
        border: false,
        hideEmptyLabel: false,
        fieldDefaults: {
            labelWidth: 160,
            labelAlign: 'right',
            msgTarget: 'side'
        },
        layout: {
            type: 'vbox',
            padding: '5 5 5 5'
        },
        items: [{
            xtype: "datefield",
            name: 'start',
            width:300,
            format:'d M Y',
            fieldLabel: 'Start of Simulation Period',
            id:"qrmID-startSimulationPeriod"
               
        }, {
           xtype: "datefield",
           name: 'end',
           width:300,
           format:'d M Y',
           fieldLabel: 'End of Simulation Period',
           id:"qrmID-endSimulationPeriod"
               
        }, {
            xtype: "numberfield",
            name:'iterations',
            fieldLabel: 'Number of Iterations',
            minValue:50,
            maxValue:5000,
            value:2000
        },{
           xtype: 'fieldcontainer',
           defaultType: 'checkboxfield',
           hideEmptyLabel: false,
           defaults: {
               layout: '100%'
           },
           fieldDefaults: {
               msgTarget: 'under',
               labelAlign: 'right',
               width:500
           },
           items: [

        {
           xtype:'checkbox',
           name: "forceRiskActive",
           boxLabel:'Force risks to be active'
        },
        {
           xtype:'checkbox',
           name: "forceConsequencesActive",
           boxLabel:'Force consequences to be active'
        }
        ]
        }

        ]
    }),
    Ext.create('Ext.grid.Panel', {
       id:'qrmID-monteRiskTable',
       store: new Ext.data.ArrayStore({
          fields: ['riskID', 'riskProjectCode', 'currentTolerance','title'],
          idIndex: 0,
          autoLoad: false
      }),
       width:'100%',
       flex:1,
       columns : [
                  {
                     text:'Risk Code',
                     width:85,
                     dataIndex:'riskProjectCode',
                     tdCls : 'x-change-cell'
                  }, {
                     width:50,
                     align:'center',
                      dataIndex:'currentTolerance',
                     renderer: function (value, metaData, record, row, col, store, gridView) {
                        return "<img src='/images/tol"+value+".png'></img>";
                     }
                  }, {
                     text:'Title',
                     flex :1,
                     dataIndex:'title'
                  }    
       ],
       viewConfig: {
          getRowClass: function(record, index) {
             var tol = record.get('currentTolerance');
             return 'rank'+tol;

         }
       }
   }) ]
});

