/**
 * 
 */

Ext.define('QRM.view.editor.ProbTab', {
   xtype: 'qrmXType-riskEditorProb',
   extend: "Ext.panel.Panel",
   border: false,
   layout: {
      type: 'hbox',
      padding: '5 5 5 5',
      align:'middle'
   },

   items: [{
      xtype: 'panel',
      width: 300,
      height: 300,
      border:false,
      id: 'qrm-riskEditorProbMatrixID'
   },

   Ext.create('Ext.form.Panel', {
      border: false,
      width: 440,
      id:'qrm-RiskEditorProbTabFormID',
      trackResetOnLoad:true,
      hideEmptyLabel: false,
      fieldDefaults: {
         labelAlign: 'right',
         labelWidth: 160,
         enableKeyEvents: true
      },
      layout: {
         type: 'vbox',
         padding: '10 20 30 10',
         align: 'stretch' // Child items are stretched to full width
      },
      items: [

              {
                 xtype: 'fieldcontainer',
                 defaultType: 'checkboxfield',
                 hideEmptyLabel: false,
                 defaults: {
                    layout: '100%'
                 },
                 fieldDefaults: {
                    msgTarget: 'under',
                    labelAlign: 'right'
                 },
                 items: [{
                    xtype: 'checkboxfield',
                    boxLabel: 'Use Calculated Probability',
                    name: "useCalculatedProb",
                    id:'qrm-RiskEditorUseCalculatedProbID'

                 }]
              },

              {
                 xtype: 'fieldset',
                 title: 'Un Treated Risk',
                 collapsible:false,
                 defaults: {
                    anchor: '100%',
                    layout:{
                       type:'vbox'
                    }
                 },

                 items: [
                         {
                            xtype: 'combobox',
                            fieldLabel: 'Frequency Type',
                            id:'qrm-RiskEditorProbFreqTypeUnTreatedID',
                            disabled:true,
                            forceSelection: true,
                            displayField: 'name',
                            valueField: 'value',
                            allowBlank: true,
                            queryMode: 'local',
                            name:'liketype',
                            store:Ext.create('Ext.data.Store',{
                               fields:["name", "value"],
                               data:[
                                     {name:"Frequency per Year", value:1},
                                     {name:"Frequency per Month", value:2},
                                     {name:"Frequency per Days", value:3}

                                     ]                    
                            })

                         },
                         {
                            xtype: 'numberfield',
                            fieldLabel: 'Frequency of Occurance',
                            id:'qrm-RiskEditorProbFreqOccUnTreatedID',
                            name:'likealpha',
                            disabled:true,
                            minValue:0,
                            width:100
                         }, {
                            xtype: 'numberfield',
                            fieldLabel: 'Number of Days',
                            id:'qrm-RiskEditorProbDaysUnTreatedID',
                            name: "liket",
                           disabled:true,
                            minValue:0,
                            width:100
                         },
                         {
                            xtype: 'displayfield',
                            id:'qrm-RiskEditorProbProbUnTreatedID',
                            fieldLabel: 'Probability',
                            value: '-'
                         }
                         ]
              },
              {
                 xtype: 'fieldset',
                 title: 'Treated Risk',
                 collapsible:false,
                 defaults: {
                    anchor: '100%',
                    layout:{
                       type:'vbox'
                    }
                 },

                 items: [
                         {
                            xtype: 'combobox',
                            fieldLabel: 'Frequency Type',
                            forceSelection: true,
                            displayField: 'name',
                            valueField: 'value',
                            id:'qrm-RiskEditorProbFreqTypeTreatedID',
                            name:'likepostType',
                            disabled:true,
                            allowBlank: true,
                            queryMode: 'local',
                            store:Ext.create('Ext.data.Store',{
                               fields:["name", "value"],
                               data:[
                                     {name:"Frequency per Year", value:1},
                                     {name:"Frequency per Month", value:2},
                                     {name:"Frequency per Days", value:3}
                                     ]                    
                            })
                         },
                         {
                            xtype: 'numberfield',
                            fieldLabel: 'Frequency of Occurance',
                            id:'qrm-RiskEditorProbFreqOccTreatedID',
                            name: "likepostAlpha",
                            disabled:true,
                            minValue:0,
                            width:100
                         }, {
                            xtype: 'numberfield',
                            fieldLabel: 'Number of Days',
                            id:'qrm-RiskEditorProbDaysTreatedID',
                            name: "likepostT",
                            disabled:true,
                            minValue:0,
                            width:100
                         },
                         {
                            xtype: 'displayfield',
                            id:'qrm-RiskEditorProbProbTreatedID',
                            fieldLabel: 'Probability',
                            value: '-'
                         }
                         ]
              }
              ]
   })
   ]
});