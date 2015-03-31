/**
 * 
 */

Ext.define('QRM.view.explorer.FilterPanel', {
   xtype : 'qrm-filterpanel',
   extend : "Ext.panel.Panel",
   border : false,
   animCollapse: true,
   collapsible: true,
   title : 'Risk Explorer Filters',
   layout : { 
      type : 'hbox',
      align : 'top',
      defaultMargins : {top: 5, right: 5, bottom: 5, left: 5}
   },
   items : [ 
            Ext.create('Ext.form.Panel', {
               border : false,
               layout :  'vbox',
               items:[ {
                  html:"<strong>Un Treated Risks:</strong><br/><br/>",
                  border:false,
                  height:18
               },
               {
                  id: 'qrm-UntreatedMatrix',
                  xtype: 'box',
                  border:false,
                  height: 180,
                  width : 180,
                  html:"<div id='untreatedMat'></div>"
               }
               ]
            }),
            Ext.create('Ext.form.Panel', {
               border : false,
               layout: 'vbox',
               items:[ {
                  html:"<strong>Treated Risks:</strong><br/><br/>",
                  border:false,
                  height:18
               },
               {
                  id: 'qrm-TreatedMatrix',
                  xtype: 'box',
                  border:false,
                  height: 180,
                  width: 180,
                  html:"<div id='treatedMat'></div>"
               } ]
            }),
            Ext.create('Ext.form.Panel', {
               border : false,
               layout: 'vbox',
               width:180,
               height:170,

               items: [  {
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
                             id:'comboRiskOwner',
                             name :'RiskOwner',
                             forceSelection:true,
                             displayField:'name',
                             valueField:'stakeholderID',
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
                             id:'comboRiskManager',
                             name :'RiskManager',
                             forceSelection:true,
                             displayField:'name',
                             valueField:'stakeholderID',
                             allowBlank:true,
                             queryMode:'local'
                          }
                          ]
               },{
                  xtype: 'fieldcontainer',
                  margins :'15 0 0 0',
                  fieldLabel: 'Risk Category',
                  labelCls : 'field-container-label',
                  width:180,
                  layout: 'anchor',
                  defaults: {
                     layout: '100%'
                  },
                  fieldDefaults: {
                     msgTarget: 'under',
                     checked   : true,
                     labelAlign: 'top'
                  },
                  items: [
                          {
                             xtype :'combobox',
                             width:170,
                             id:'comboCategory',
                             forceSelection:true,
                             displayField:'description',
                             valueField:'internalID',
                             name  : 'RiskCategory',
                             queryMode:'local'
                          }
                          ]
               }
               ]
            }),
            Ext.create('Ext.form.Panel', {
               trackResetOnLoad:false,
               border : false,
               layout: 'vbox',
               width:140,
               height:170,
               items: [  {
                  xtype: 'fieldcontainer',
                  fieldLabel: 'Exposure Status',
                  defaultType: 'checkboxfield',
                  labelCls : 'field-container-label',
                  width:140,
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
                             boxLabel  : 'Active',
                             checked   : true,
                             id        : 'cbActive'
                          }, {
                             boxLabel  : 'Pending',
                             checked   : true,
                             id        : 'cbPending'
                          }, {
                             boxLabel  : 'Inactive',
                             checked   : true,
                             id        : 'cbInactive'
                          }
                          ]
               },{
                  xtype: 'fieldcontainer',
                  margins :'15 0 0 0',
                  fieldLabel: 'Treatment Status',
                  labelCls : 'field-container-label',
                  width:140,
                  defaultType: 'checkboxfield',
                  layout: 'anchor',
                  defaults: {
                     layout: '100%'
                  },
                  fieldDefaults: {
                     msgTarget: 'under',
                     checked   : true,
                     labelAlign: 'top'
                  },
                  items: [
                          {
                             boxLabel  : 'Treated',
                             checked   : true,
                             id        : 'cbTreated'
                          }, {
                             boxLabel  : 'Untreated',
                             checked   : true,
                             id        : 'cbUntreated'
                          }
                          ]
               }
               ]
            }),
            Ext.create('Ext.form.Panel', {
               border : false,
               items: [  {
                  xtype: 'fieldcontainer',
                  fieldLabel: 'Tolerance',
                  labelCls : 'field-container-label',
                  defaultType: 'checkboxfield',
                  layout: {
                     type:'table',
                     columns : 2,
                     tdAttrs :{
                        style :{
                           width:100
                        }
                     }
                  },
                  defaults: {
                     layout: '100%'
                  },
                  fieldDefaults: {
                     msgTarget: 'under',
                     labelAlign: 'top'
                  },
                  items: [

                          {
                             boxLabel  : 'Extreme',
                             checked   : true,
                             id        : 'cbExtreme'
                          }, {
                             boxLabel  : 'High',
                             checked   : true,
                             id        : 'cbHigh'
                          },
                          {
                             boxLabel  : 'Significant',
                             checked   : true,
                             id        : 'cbSignificant'
                          }, {
                             boxLabel  : 'Moderate',
                             checked   : true,
                             id        : 'cbModerate'
                          },
                          {
                             boxLabel  : 'Low',
                             checked   : true,
                             id        : 'cbLow'
                          }
                          ]
               },
               {
                  xtype: 'fieldcontainer',
                  margins :'15 0 0 0',
                  fieldLabel: 'Risk Code',
                  labelCls : 'field-container-label',
                  layout: 'anchor',
                  defaults: {
                     layout: '100%'
                  },
                  fieldDefaults: {
                     msgTarget: 'under',
                     labelAlign: 'top'
                  },
                  items: [{
                     xtype:'textfield',
                     id :'txtRiskCode',
                     enableKeyEvents:true,
                  }
                  ]
               }
               ]
            })
            ]
});