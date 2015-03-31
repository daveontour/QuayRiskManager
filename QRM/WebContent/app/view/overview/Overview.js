
Ext.define('QRM.view.overview.Overview', {
    xtype: 'qrm-overviewPanel',
    extend: "Ext.panel.Panel",
    border: false,
    layout: 'border',
    items: [{
        xtype: 'panel',
        layout: {
           type: 'hbox',
           align: 'stretch'
       },        border: true,
        region: 'center',
        items: [
              Ext.create('Ext.grid.Panel', {
                  title: 'Project Data',
                  flex:1,
                  store: metricOverviewData,
                  columns: [{
                      text: 'Metric',
                      width: 250,
                      dataIndex: 'data'
                  }, {
                      text: 'Value',
                      flex: 1,
                      dataIndex: 'value'
                  }]
              }),

              Ext.create('Ext.grid.Panel', {
                 flex:1,
                 title: 'Significant Events',
                 store: sigEventsStore,
                 features: [{
                     ftype: 'grouping',
                     groupHeaderTpl: [
                         '{name:this.formatName} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})', {
                         formatName: function (name) {
                             switch (name) {
                                 case 'INCIDENT':
                                     return "Incidents";
                                     break;
                                 case 'RISK':
                                     return "Recently Added Risks";
                                     break;
                                 case 'REVIEW':
                                     return "Upcoming Reviews";
                                     break;
                                 case 'TASKS':
                                     return "Outstanding User Tasks";
                                     break;
                             }
                         }
                     }],
                     hideGroupedHeader: false,
                     startCollapsed: true,
                     id: 'taskGrouping'
                 }],
                 columns: [{
                     text: 'Event',
                     flex: 1,
                     dataIndex: 'name'
                 }, {
                     text: 'Date',
                     width: 100,
                     dataIndex: 'date',
                     align:'center',
                     renderer:Ext.util.Format.dateRenderer('d M Y'),
                 }]
             })
        ]
    }, {
        xtype: 'panel',
        border: true,
        region: 'south',
        height: 250,
        layout: {
           type: 'hbox',
           align: 'stretch'
       }, 
       border: true,
        items: [{
            xtype: 'panel',
            title: '<center>Exposure Status Allocation</center>',
            layout: 'fit',
            height: 250,
            flex:1,
            border: false,
            items: [{
                xtype: 'chart',
                border: false,
                store: store1,
                series: [{
                    type: 'pie',
                    field: 'data',
                    label: {
                        field: 'element'
                    },
                    renderer: function (sprite, record, attr, index, store) {
                        var value = record.data.element,
                            color;
                        if (value == 'Pending') {
                            color = "#ffa500";
                        } else if (value == 'Active') {
                            color = "#dc143c";
                        } else if (value == 'Inactive') {
                            color = "#7fff00";
                        } else {
                            color = "#ccc";
                        }
                        return Ext.apply(attr, {
                            fill: color
                        });
                    },
                    tips: {
                        trackMouse: true,
                        width: 140,
                        height: 28,
                        renderer: function (storeItem, item) {
                            var total = 0;
                            store1.each(function (rec) {
                                total += rec.get('data');
                            });
                            this.setTitle(storeItem.get('element') + ': ' + Math.round(storeItem.get('data') / total * 100) + '%');
                        }
                    },
                    label: {
                        field: 'element',
                        display: 'rotate',
                        contrast: true,
                        font: '14px Arial'
                    },
                    listeners: {
                       itemclick: function (me) {
                          statusFind(me.storeItem.data.element);
                       }
                   }


                }]
            }]
        }, {
            xtype: 'panel',
            title: '<center>Treatment Allocation</center>',
            layout: 'fit',
            height: 250,
            flex:1,
            border: false,
            items: [{
                xtype: 'chart',
                border: false,
                store: store2,
                series: [{
                    type: 'pie',
                    field: 'data',
                    label: {
                        field: 'element'
                    },
                    renderer: function (sprite, record, attr, index, store) {
                        var value = record.data.element,
                            color;
                        if (value == 'Treated') {
                            color = "#7fff00";
                        } else if (value == 'Un Treated') {
                            color = "#dc143c";
                        } else {
                            color = "#ccc";
                        }
                        return Ext.apply(attr, {
                            fill: color
                        });
                    },
                    tips: {
                        trackMouse: true,
                        width: 140,
                        height: 28,
                        renderer: function (storeItem, item) {
                            var total = 0;
                            store2.each(function (rec) {
                                total += rec.get('data');
                            });
                            this.setTitle(storeItem.get('element') + ': ' + Math.round(storeItem.get('data') / total * 100) + '%');
                        }
                    },
                    label: {
                        field: 'element',
                        display: 'rotate',
                        contrast: true,
                        font: '14px Arial'
                    },
                    listeners: {
                       itemclick: function (me) {
                          treatmentFind(me.storeItem.data.element);
                       }
                   }

                }]
            }]
        }, {
            xtype: 'panel',
            title: '<center>Tolerance Allocation</center>',
            layout: 'fit',
            height: 250,
            flex:1,
            border: false,
            items: [{
                xtype: 'chart',
                border: false,
                store: store3,
                series: [{
                    type: 'pie',
                    field: 'data',
                    label: {
                        field: 'element'
                    },
                    renderer: function (sprite, record, attr, index, store) {
                        var value = record.data.element,
                            color;
                        if (value == 'Low') {
                            color = "#0ff";
                        } else if (value == 'Moderate') {
                            color = "#0f0";
                        } else if (value == 'Significant') {
                            color = "#ff0";
                        } else if (value == 'High') {
                            color = "#ffa500";
                        } else if (value == 'Extreme') {
                            color = "#f00";
                        } else {
                            color = "#ccc";
                        }
                        return Ext.apply(attr, {
                            fill: color
                        });
                    },
                    tips: {
                        trackMouse: true,
                        width: 140,
                        height: 28,
                        renderer: function (storeItem, item) {
                            var total = 0;
                            store3.each(function (rec) {
                                total += rec.get('data');
                            });
                            this.setTitle(storeItem.get('element') + ': ' + Math.round(storeItem.get('data') / total * 100) + '%');
                        }
                    },
                    label: {
                        field: 'element',
                        display: 'rotate',
                        contrast: true,
                        font: '14px Arial'
                    },
                    listeners: {
                       itemclick: function (me) {
                           toleranceFind(me.storeItem.data.element);
                       }
                   }

                }]
            }]
        }, {
            xtype: 'panel',
            title: '<center>Mitigation Plan Approval</center>',
            layout: 'fit',
            height: 250,
            border:false,
            flex:1,
            items: [{
                xtype: 'chart',
                border: false,
                store: store4,
                series: [{
                    type: 'pie',
                    field: 'data',
                    label: {
                        field: 'element'
                    },
                    renderer: function (sprite, record, attr, index, store) {
                        var value = record.data.element,
                            color;
                        if (value == 'Approved') {
                            color = "#0f0";
                        } else if (value == 'Not Approved') {
                            color = "#f00";
                        } else {
                            color = "#ccc";
                        }
                        return Ext.apply(attr, {
                            fill: color
                        });
                    },
                    tips: {
                        trackMouse: true,
                        width: 140,
                        height: 28,
                        renderer: function (storeItem, item) {
                            var total = 0;
                            store4.each(function (rec) {
                                total += rec.get('data');
                            });
                            this.setTitle(storeItem.get('element') + ': ' + Math.round(storeItem.get('data') / total * 100) + '%');
                        }
                    },
                    label: {
                        field: 'element',
                        display: 'rotate',
                        contrast: true,
                        font: '14px Arial'
                    },
                    listeners: {
                       itemclick: function (param) {
                           msg("Mitigation Plan Approvals", "The functionality to display the list of risks based on mitigation plan approval has not been implemented yet.");
                       }
                   }

                }]
            }]
        }]
    }]
});