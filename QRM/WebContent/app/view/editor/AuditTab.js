/**
 * 
 */

Ext.define('QRM.view.editor.AuditTab', {
   xtype: 'qrmXType-riskEditorAudit',
   extend: "Ext.panel.Panel",
   border: false,
   layout: {
      type: 'vbox',
      padding: '0 0 0 0',
      align: 'stretch' // Child items are stretched to full width
   },
   items: [
           {
              html: "<strong>Scheduled Reviews for this Risk</strong><br/><br/>",
              border: false
           },

           Ext.create('Ext.grid.Panel', {
              id:'qrmID-RiskEditorReviewGrid',
              collapsible: false,
              multiSelect: true,
              store:new Ext.data.ArrayStore({
                 fields: [
                          {name:'title', type:'string'},
                          {name:'comment', type:'string'},
                          {name:'scheduleDate', type:'date'}, 
                          {name:'actualDate', type:'date'}
                          ],
                          idIndex: 0,
                          autoLoad: false
              }),
              flex: 1,
              width: '100%',
              columns: [
                        {
                           text: 'Review Title',
                           align:'left',
                           tdCls:'wrap-text',
                           dataIndex:'title',
                           flex:1
                        },
                        {
                           text:'Review Comment for Risk',
                           dataIndex:'comment',
                           tdCls:'wrap-text',
                           flex:1

                        }, {
                           dataIndex: "scheduleDate",
                           text: "Scheduled Date",
                           width: 150,
                           tdCls:'top-text',
                           renderer: Ext.util.Format.dateRenderer('d M Y'),
                           align: "center"
                        }, {
                           dataIndex: "actualDate",
                           text: "Actual Date",
                           width: 150,
                           tdCls:'top-text',
                           renderer: Ext.util.Format.dateRenderer('d M Y'),
                           align: "center"
                        }
                        ],
                        viewConfig: {
                           emptyText: 'No Scheduled Reviews Found for this Risk'
                        },
                        dockedItems: [{
                           xtype: 'toolbar',
                           dock: 'bottom',
                           ui: 'footer',
                           items: [{
                              xtype: 'component',
                              flex: 1
                           }, {
                              text: 'Schedule Review',
                              width:110,
                              id:'qrmID-RiskEditorScheduleReviewBtn'
                           }
                           ]
                        }]
           }),
           {
              html: "<strong>Process Audit Milestones</strong><br/><br/>",
              border: false
           },

           Ext.create('Ext.grid.Panel', {
              id:'qrmID-RiskEditorAuditGrid',
              collapsible: false,
              multiSelect: true,
              store:new Ext.data.ArrayStore({
                 fields: [{name:'step', type:'string'},
                          {name:'dateEntered', type:'date'},
                          {name:'personName', type:'string'}, 
                          {name:'comment', type:'string'}],
                          idIndex: 0,
                          autoLoad: false
              }),
              flex: 1,
              width: '100%',
              columns: [               
                        {
                           dataIndex: "step",
                           text: "Audit Point",
                           width: 200,
                           tdCls:'top-text',
                           align: "left"
                        }, {
                           dataIndex: "dateEntered",
                           text: "Date",
                           width: 150,
                           align: "center",
                           tdCls:'top-text',
                           renderer: Ext.util.Format.dateRenderer('d M Y'),
                        }, {
                           dataIndex: "personName",
                           text: "Person",
                           width: 200,
                           tdCls:'top-text',
                           align: "center"
                        }, {
                           dataIndex: "comment",
                           text: "Comment",
                           flex:1,
                           tdCls:'wrap-text',
                           align: "left"
                        }
                        ],
                        viewConfig: {
                           getRowClass: function(record, index) {
                              if (record.raw.dateEntered == null) {
                                 return "redText";
                              } else {
                                 return "blueText";
                              }                 
                           }
                        },
                        dockedItems: [{
                           xtype: 'toolbar',
                           dock: 'bottom',
                           ui: 'footer',
                           items: [{
                              xtype: 'component',
                              flex: 1
                           }, {
                              text: 'Register Audit',
                              width:110,
                              id:'qrmID-RiskEditorRegisterAuditBtn'
                           }
                           ]
                        }]
           })
           ]           
});