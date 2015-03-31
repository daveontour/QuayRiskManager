Ext.define('QRM.view.rank.RankWindow', {
    xtype: 'qrm-rankWindow',
    extend: "Ext.grid.Panel",
    border: false,
    collapsible: false,
    id: "qrm-SubRankGrid",
    multiSelect: false,
    width: '100%',
    store: 'Rank',
    // store: rankStore,
    selModel: {
        allowDeselect: true
    },
    columns: [{
        xtype: 'rownumberer',
        align: 'center',
        width: 40,
        sortable: false
    }, {
        text: 'Risk Code',
        width: 85,
        dataIndex: 'riskProjectCode',
        tdCls: 'x-change-cell'
    }, {
        text: 'Tolerance',
        width: 80,
        align: 'center',
        dataIndex: 'currentTolerance',
        renderer: function (value, metaData, record, row, col, store, gridView) {
            return "<img src='/images/tol" + value + ".png'></img>";
        }
    }, {
        text: 'Title',
        flex: 1,
        dataIndex: 'title'
    }],
    viewConfig: {
        getRowClass: function (record, index) {
            var tol = record.get('currentTolerance');
            return 'rank' + tol;

        },
        plugins: {
            ptype: 'gridviewdragdrop',
            dragText: 'Drag and drop to reorganize'

        },
        listeners: {
            itemmouseenter: function (view, record, item, index, e, eOpts) {
                var data = record.data;
                var html = "<div style='valign:top'><br><hr><strong>" + data.riskProjectCode + " - " + data.title + "<br><br>Description:<br><br></strong>" + data.description.substring(0, 500) + "<hr></div>";
                Ext.getCmp('qrm-rankDetail').update(html);
            },
            drop: function () {
                QRM.app.getRankingController().dirty = true;
                Ext.getCmp("qrm-SubRankGrid").getSelectionModel().deselectAll(true);
            }
        }
    }
});