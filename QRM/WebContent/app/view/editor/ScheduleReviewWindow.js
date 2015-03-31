/**
 * 
 */



Ext.define('QRM.view.editor.ScheduleReviewWindow', {
    xtype: 'qrmXType-ScheduleReviewWindow',
    extend: "Ext.window.Window",
    title: 'Schedule Review for Selected Risks',
    border: false,
    modal: true,
    draggable: false,
    closeAction: 'hide',
    height: 400,
    width: 800,
    fromGrid:false,
    layout: 'vbox',
    align: 'stretch',
    padding: "0 0 0 0",
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        ui: 'footer',
        items: [{
            xtype: 'component',
            flex: 1
        }, {
            text: 'Cancel',
            width: 110,
            handler: function () {
                scheduleReviewWindow.close();
            }
        }, {
            text: 'Save',
            width: 110,
            id: 'qrmID-AddNewReviewForRiskBtn'
        }]
    }],
    items: [
    Ext.create('Ext.form.Panel', {
        id: 'qrm-scheduleReviewFormID',
        width: '100%',
        flex: 1,
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
            xtype: 'radiogroup',
            fieldLabel: 'Review',
            labelAlign: 'right',
            columns: 1,
            allowBlank: false,
            id:'qrmID-NewReviewTypeSelector',
            items: [{
                boxLabel: 'New Review',
                name: 'type',
                checked:true,
                inputValue: 0
            }, {
                boxLabel: 'Existing Review',
                name: 'type',
                inputValue: 1
            }]
        }, {
            xtype: "datefield",
            name: 'date',
            width:300,
            format:'d M Y',
            fieldLabel: 'New Review Date',
            id:"qrmID-NewReviewDate"
               
        }, {
            xtype: "textfield",
            name: 'description',
            width:700,
            fieldLabel: 'New Review Description',
            id:"qrmID-NewReviewDescription"
               
        }, {
            xtype: "combobox",
            name: 'existing',
            fieldLabel: 'Existing Review',
            displayField: 'title',
            valueField:'reviewID',
            width:700,
            store: new Ext.data.ArrayStore({
               fields: ['reviewID', 'title'],
               idIndex: 0,
               autoLoad: false
           }),
            queryMode: 'local',
            id:"qrmID-ExistingReviewSelector"

        }

        ]
    }),
    Ext.create('Ext.grid.Panel', {
       id:'qrmID-NewReviewRiskTable',
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

