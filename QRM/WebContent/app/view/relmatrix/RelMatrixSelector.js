/**
 * 
 */

Ext.define('QRM.view.relmatrix.RelMatrixSelector', {
    xtype: 'qrm-relMatrixSelector',
    extend: "Ext.panel.Panel",
    border: false,
    layout: 'border',
    items: [
 {
        xtype: 'panel',
        region: 'north',
        layout: 'vbox',
        border: false,
        height: 280,
        items: [

        Ext.create('Ext.FormPanel', {
            border: false,
            margin:5,
            items: [{
               xtype: 'fieldcontainer',
               fieldLabel: 'Locate Risk',
               labelCls : 'field-container-label',
               width:180,
               layout: 'anchor',
               defaults: {
                  layout: '100%'
               },
               fieldDefaults: {
                  msgTarget: 'under',
                  labelAlign: 'top'
               },
               items: [
                       {
                          xtype :'combobox',
                          width:170,
                          id:'comboFindRiskMat',
                          name :'FindRisk',
                          forceSelection:false,
                          displayField:'riskCode',
                          valueField:'riskProjectCode',
                          queryMode:'local',
                          store: relMatRiskStore,
                          matchFieldWidth:false,
                          listConfig: {
                             getInnerTpl: function() {
                                 return '<strong>{riskProjectCode}</strong> - {title}';
                             },
                             width:500
                          }
                       }
                       ]
            },{
               xtype: 'fieldcontainer',
               fieldLabel: 'Risk Owner',
               labelCls : 'field-container-label',
               width:180,
               layout: 'anchor',
               defaults: {
                  layout: '100%'
               },
               fieldDefaults: {
                  msgTarget: 'under',
                  labelAlign: 'top'
               },
               items: [
                       {
                          xtype :'combobox',
                          width:170,
                          id:'comboRiskOwnerMat',
                          name :'RiskOwner',
                          forceSelection:true,
                          displayField:'name',
                          valueField:'stakeholderID',
                          store:projectOwnersStore,
                          queryMode:'local'

                       }
                       ]
            },{
               xtype: 'fieldcontainer',
               margins :'15 0 0 0',
               fieldLabel: 'Risk Manager',
               labelCls : 'field-container-label',
               width:180,
               layout: 'anchor',
               defaults: {
                  layout: '100%'
               },
               fieldDefaults: {
                  msgTarget: 'under',
                  labelAlign: 'top'
               },
               items: [
                       {
                          xtype :'combobox',
                          width:170,
                          id:'comboRiskManagerMat',
                          name :'RiskManager',
                          forceSelection:true,
                          displayField:'name',
                          valueField:'stakeholderID',
                          store:projectManagersStore,
                          queryMode:'local'
                       }
                       ]
            },{
               xtype:'panel',
               width:180,
               height:30,
               border:false,
               dockedItems: [{
                  xtype: 'toolbar',
                  dock: 'bottom',
                  ui: 'footer',
                  style:{
                     background: 'white'
                  },
                  items: [
                          { xtype: 'component', flex: 1 },
                          { text:'Reset Filters', 
                             handler:function(){
                                $$('comboRiskOwnerMat').clearValue();
                                $$('comboRiskManagerMat').clearValue();
                                $$('comboFindRiskMat').clearValue();
                                
                                QRM.app.getRelMatrixController().svgMatrix(QRM.app.getRelMatrixController().risks);
                             }
                          }                           ]
               }],
            },{
               xtype: 'radiogroup',
               labelCls : 'field-container-label',
               msgTarget: 'under',
               labelAlign: 'top',
               id:'qrm-RelMatStateID',
               fieldLabel: 'Show Tolerance',
               columns: 1,
               items: [
                   {boxLabel: 'Current Tolerance', name: 'tolstate', checked:true, inputValue:0},
                   {boxLabel: 'Un Treated Tolerance', name: 'tolstate', inputValue:1},
                   {boxLabel: 'Treated Tolerance', name: 'tolstate', inputValue:2}
               ]
           }]
        })]
    },{
       id:'qrm-RelMatSelectorDetail',
       region:'center',
       border:false
    },{
       region:"south",
       height:100,
       border:false,
       html : '<svg><g transform="translate(100 0)">'+
       '<circle cx="50" cy="50" r="42" fill="white" opacity="0.75"/>'+
       '<path class="compass-button" onclick="QRM.app.getRelMatrixController().pan( 0, 50)" d="M50 10 l12   20 a40, 70 0 0,0 -24,  0z"/>'+
       '<path class="compass-button" onclick="QRM.app.getRelMatrixController().pan( 50, 0)" d="M10 50 l20  -12 a70, 40 0 0,0   0, 24z"/>'+
       '<path class="compass-button" onclick="QRM.app.getRelMatrixController().pan( 0,-50)" d="M50 90 l12  -20 a40, 70 0 0,1 -24,  0z"/>'+
       '<path class="compass-button" onclick="QRM.app.getRelMatrixController().pan(-50, 0)" d="M90 50 l-20 -12 a70, 40 0 0,1   0, 24z"/>'+
       '<circle class="compass" cx="50" cy="50" r="20" onclick="QRM.app.getRelMatrixController().resetPZ()"/>'+
       '<circle class="compass-button" cx="50" cy="41" r="8" onclick="QRM.app.getRelMatrixController().zoom(0.8)"/>'+
       '<circle class="compass-button" cx="50" cy="59" r="8" onclick="QRM.app.getRelMatrixController().zoom(1.25)"/>'+
       '<rect class="plus-minus" x="46" y="39.5" width="8" height="3"/>'+
       '<rect class="plus-minus" x="46" y="57.5" width="8" height="3"/>'+
       '<rect class="plus-minus" x="48.5" y="55" width="3" height="8"/>'+
       '</g></svg>'
    }
    ]
});