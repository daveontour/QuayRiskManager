/**
 * 
 */

Ext.define('QRM.view.summary.SummaryPanel', {
    xtype: 'qrm-SummaryPanel',
    extend: "Ext.panel.Panel",
    border: false,
    layout: 'border',
    items: [{
        xtype: 'panel',
        region: 'center',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'qrm-summaryRiskTree',
            flex: 1
        }, {
            xtype: 'qrm-summaryrisk-grid',
            flex: 1
        }

        ],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            items: [{
                xtype: 'component',
                flex: 1
            }, {
                text: 'Cancel Changes',
                id:'qrm-SummaryRiskCancelBtnID',
                width: 110
                // handled in Controller
            }, {
                text: 'Save Changes',
                id:'qrm-SummaryRiskSaveBtnID',
                width: 110
                // handled in Controller
            }, {
                text: 'New Risk',
                width: 110,
                id:'qrm-SummaryRiskNewBtnID',                
             }, {
                text: 'Export Chart',
                width: 110,
                handler: function () {
                    //
                }
            }]
        }]
    }, {
        xtype: 'panel',
        region: 'south',
        height: 200,
        layout: 'hbox',
        items: [{
            xtype: 'gridpanel',
            width: 300,
            height: '100%',
            id: 'trashTarget',
            width: 400,
            store: new Ext.data.ArrayStore({
               fields: ['discardTitle'],
               storeId: 'trashTargetStore',
               autoLoad: false
           }),
            columns: [{
               text: 'Drag Discarded Relationships Here',
               flex: 1,
               dataIndex: 'discardTitle',
               tdCls: 'x-change-cell',
               renderer: function (value, metaData, record, row, col, store, gridView) {
                   return "<span style='color:red'>" + value + "</span>";
               }
            }],
            viewConfig: {
                getRowClass: function (record, index) {
                    return 'dirtyMove';
                },
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dropGroup: 'summRiskDD',
                    dragGroup: 'summRiskDD',
                    enableDrag: false
                },
                listeners: {
                    beforedrop: function (node, data, dropRec, dropPosition, dropHandlers) {
                        var rec = data.records[0];
                        var risk = rec.data;
                        var parentNode = QRM.app.getStore('RiskTree').getRootNode().findChild('riskProjectCode', risk.riskProjectCode, true).parentNode;
                        var parentRisk = parentNode.data;
                         // Don't allow Summary Risks or Propagated Risks to be moved            
                        if (data.view.xtype != 'gridview') {
                            if (!risk.leaf) {
                                Ext.Msg.alert('Summary and Propogated Risks', 'You cannot discard a summary or top propogated risk');
                                return false;
                            }
                        } else {
                            return false;
                        }
                        // Check for moving a  propagated Risk
                        var parentNode = QRM.app.getStore('RiskTree').getRootNode().findChild('riskProjectCode', risk.riskProjectCode, true).parentNode;
                        if (parentNode.forceDownRisk) {
                            Ext.Msg.alert('Summary and Propogated Risks', 'Cannot discard the child of a propagated risk');
                            return false;
                        }

                        // Confirm intention
                        dropHandlers.wait = true;
                        Ext.MessageBox.confirm('Remove Child Risk', 'Discard relationship between ' + parentRisk.riskProjectCode + ' and ' + risk.riskProjectCode, function (btn) {
                            if (btn === 'yes') {
                                risk.discardTitle = parentRisk.riskProjectCode + ' - ' + risk.riskProjectCode;
                                risk.removeChild = 1;
                                QRM.app.getSummaryRisksController().dirtyRecords.push(risk);
                                dropHandlers.processDrop();
                            } else {
                                dropHandlers.cancelDrop();
                            }
                        });

                    },
                    drop: function(node, data, dropRec, dropPosition) {
                       QRM.app.getSummaryRisksController().dirty = true; 
                     }
                }
            }
        },
        {
           xtype:"propertygrid",
           height:"100%",
           flex:1,
           sortableColumns:false,
           id:"qrmID-summaryPanelPropertyViewer"
        }]
    }]
});