/**
 * 
 */

var statusRowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
   clicksToMoveEditor: 1,
   autoCancel: false,
   listeners:{
      beforeedit: {
          fn: function(editor, context, eOpts){ 
             if (context.record.data.type != 'General Comment' || context.record.data.enteredByID != QRM.global.userID){
                Ext.Msg.show({
                   title: 'Edit Comment',
                   msg: '<center>Only "General Comments" which you previously entered can be edited</center>',
                   width: 400,
                   buttons: Ext.Msg.OK,
                   icon: Ext.Msg.INFO
               });
                return false;
                }
             }
     },
     edit: {
          fn: function(editor, context){ 
            Ext.Ajax.request({
                url: "./addUpdateComment",
                params: {
                   "RISKID": QRM.global.currentRisk.riskID,
                   "COMMENT": context.record.data.comment,
                   "COMMENTID":context.record.data.internalID
                },
                callback: function(response){
                   riskCommentStore.load({ params: {
                      "RISKID": QRM.global.currentRisk.riskID,
                      "PROJECTID":QRM.global.projectID
                   }
                   });
                }
             });
          }
     },
     canceledit: {
        fn: function(editor, context){ 
           riskCommentStore.load({ params: {
              "RISKID": QRM.global.currentRisk.riskID,
              "PROJECTID":QRM.global.projectID
           }
           });
        }
   }
   }
});

Ext.define('QRM.view.editor.StatusTab', {
    xtype: 'qrmXType-riskEditorStatus',
    extend: "Ext.panel.Panel",
    border: false,
    layout: {
        type: 'vbox',
        padding: '5 5 5 5',
        align: 'stretch' // Child items are stretched to full width
    },

    items: [{
        html: "<strong>Risk Status Updates and Comments</strong><br/><br/>",
        border: false
    },

    Ext.create('Ext.grid.Panel', {
        id: 'qrmID-RiskEditorStatusGrid',
        collapsible: false,
        multiSelect: true,
        store: riskCommentStore,
        selType: 'checkboxmodel',
        flex: 1,
        plugins: [statusRowEditing],
        width: '100%',
        columns: [{
            text: 'Comment',
            align: 'left',
            dataIndex: 'comment',
            tdCls: 'wrap-text',
            flex: 1,
            renderer: function (value, metaData, model, row, col, store, gridView) {

                var record = model.data;

                if (record.approval || record.review) {
                    return "<span style='color:blue;vertical-align:top'>" + value + "</span>";
                } else if (record.schedReview) {
                    return "<span style='color:orange;vertical-align:top'>" + value + "</span>";
                } else {
                    return value;
                }
            },
            editor: {
               xtype:'textarea',
               allowBlank: false,
               autoSizing:true,
               height:70,
               listeners: {
                  inputEl: {
                      keydown: function(ev) {
                          ev.stopPropagation();
                      }
                  }
              }
           }
        }, {
            text: 'Type',
            width: 140,
            align: 'center',
            tdCls: 'top-text',
            dataIndex: 'type'
        }, {
            text: 'Entered By',
            width: 140,
            align: 'center',
            tdCls: 'top-text',
            dataIndex: 'personName'
        }, {
            text: 'Date',
            width: 120,
            align: 'center',
            tdCls: 'top-text',
            renderer: Ext.util.Format.dateRenderer('d M Y'),
            dataIndex: 'dateEntered'
//        }, {
//            text: 'Attachment',
//            align: 'center',
//            width: 120,
//            tdCls: 'top-text',
//            dataIndex: 'attachmentURL',
//            renderer: function (value, metaData, model, row, col, store, gridView) {
//
//                var record = model.data;
//
//                if (record.attachmentURL) {
//                    return "<a href = '" + record.attachmentURL + "' target='_blank'>Download</a>";
//                } else if (record.url) {
//                    return "<a href = '" + record.url + "' target='_blank'>View</a>";
//                } else {
//                    return "";
//                }
//            }

        }, ],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            items: [{
                xtype: 'component',
                flex: 1
            }, {
                text: 'Delete Comment',
                width: 110,
                handler:function(){
                   Ext.Msg.show({
                      title: 'Delete Comments',
                      msg: '<center>Delete Selected Comments?</center>',
                      width: 400,
                      buttons: Ext.Msg.YESNO,
                      fn: function (btn) {
                         if (btn == "yes"){
                            var data = getJSONSelection('qrmID-RiskEditorStatusGrid');
                            Ext.Ajax.request({
                               url: "./deleteComment",
                               params: {
                                  "RISKID": QRM.global.currentRisk.riskID,
                                  "COMMENTS": data
                               },
                               success: function(response){
                                  var result = Ext.decode(response.responseText);
                                  if (result){
                                     Ext.Msg.show({
                                        title: 'Delete Comment',
                                        msg: '<center>Some comments were not deleted because either you did not enter the comment or it was an Audit or Review comment</center>',
                                        width: 400,
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.Msg.INFO
                                    });
                                  } else {
                                     Ext.Msg.show({
                                        title: 'Delete Comment',
                                        msg: '<center>Comment Deleted</center>',
                                        width: 400,
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.Msg.INFO
                                    });
                                  }
                                  riskCommentStore.load({ params: {
                                     "RISKID": QRM.global.currentRisk.riskID,
                                     "PROJECTID":QRM.global.projectID
                                  }
                                  });
                               },
                               failure:function(){
                                  Ext.Msg.show({
                                     title: 'Delete Comment',
                                     msg: '<center>Error deleting selected comments</center>',
                                     width: 400,
                                     buttons: Ext.Msg.OK,
                                     icon: Ext.Msg.INFO
                                 });
                                  riskCommentStore.load({ params: {
                                     "RISKID": QRM.global.currentRisk.riskID,
                                     "PROJECTID":QRM.global.projectID
                                  }
                                  });                         
                               }
                            });
                         }
                      },
                      icon: Ext.Msg.QUESTION
                  });

                }
            }, {
                text: 'New Comment',
                width: 110,
                handler : function() {
                   
                   statusRowEditing.cancelEdit();

                   // Create a model instance
                   var r = Ext.create('StatusComment', {
                       comment: 'Enter Comments',
                       type:'General Comment',
                       personName:allUsersMap.get(QRM.global.userID).name,
                       dateEntered: new Date(),
                       enteredByID:QRM.global.userID,
                       internalID: -1
                   });

                   riskCommentStore.insert(0, r);
                   statusRowEditing.startEdit(0, 0);
               }
            }]
        }],
    }), {
        html: "<strong>Detail Mitigation Plan Updates</strong><em> (Edit Mitigation Detail Plan in 'Mitigation' Tab)</em><br/><br/>",
        border: false
    },

    Ext.create('Ext.grid.Panel', {
        id: 'qrmID-RiskEditorMitigationPlanGrid2',
        collapsible: false,
        store: new Ext.data.ArrayStore({
            fields: ['internalID', 'description', 'updates', 'personID', 'estCost', 'percentComplete', 'endDate'],
            idIndex: 0,
            autoLoad: false
        }),
        flex: 1,
        width: '100%',
        columns: [{
            text: 'Description',
            align: 'left',
            dataIndex: 'description',
            tdCls: 'wrap-text',
            flex: 1
        }, {
            text: 'Updates',
            align: 'left',
            dataIndex: 'updates',
            tdCls: 'wrap-text',
            flex: 1
        }, {
            text: 'Person Responsible',
            width: 200,
            align: 'center',
            tdCls: 'top-text',
            dataIndex: 'personID',
            renderer: function (value, metaData, model, row, col, store, gridView) {
               return allUsersMap.get(value).name;
           }            
        }, {
            text: 'Estimated Costs',
            align: 'center',
            dataIndex: 'estCost',
            tdCls: 'top-text',
            width: 150
        }, {
            text: '% Complete',
            dataIndex: 'percentComplete',
            width: 100,
            tdCls: 'top-text',
            align: 'center'
        }, {
            text: 'Date',
            dataIndex: 'endDate',
            width: 100,
            tdCls: 'top-text',
            renderer: Ext.util.Format.dateRenderer('d M Y'),
            align: 'center'
        }]
    })

    ]
});