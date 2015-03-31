Ext.define('QRM.view.MainTabs', {
    xtype: 'qrm-maintabs',
    extend: "Ext.tab.Panel",
    items: [{
        id: "tabExplorer",
        title: "Risk Explorer",
        layout: 'border',
        items: [{
            xtype: 'qrm-filterpanel',
            region: 'north',
            height: 245,
            border: false

        }, {
            xtype: 'panel',
            region: 'center',
            layout: 'anchor',
            border: false,
            items: [{
                xtype: 'qrm-explorer-grid',
                id:'qrmID-RiskTable',
                anchor: '100% 100%',
                border: false
            }]
        }]
    }, {
        title: "Issues and Incidents",
        id:"tabIncident",
        layout: 'border',
        items: [{
               xtype: 'qrm-incidentfilterpanel',
               region: 'north',
               height: 240,
               border: false

           }, {
               xtype: 'panel',
               region: 'center',
               layout: 'anchor',
               border: false,
               items: [{
                   xtype: 'qrm-incidentexplorer-grid',
                   anchor: '100% 100%',
                   border: false
               }]
           }]
    }, {
        title: "Project Overview",
        id:'tabOverview',
        xtype:'qrm-overviewPanel'
    }, {
        id: "tabCalender",
        title: "Risk Calender",
        layout: 'border',
        items: [{
            xtype: 'panel',
            region: 'center',
            layout: 'anchor',
            border: false,
            items: [{
                xtype: 'qrm-calenderpanel',
                anchor: '100% 100%',
                border: false
            }],
            dockedItems: [{
               xtype: 'toolbar',
               dock: 'bottom',
               ui: 'footer',
               items: [
                       "Ctrl-Click to open risk",
                       {
                          xtype: 'component',
                          flex: 1                    
                       }, {
                   text: 'Export Chart',
                   width: 110,
                   handler: function () {
                      exportSVG('relMatrixSVGDiv');
                   }
               }]
           }]
        }]

    }, {
        title: "Summary and Propogated Risks",
        id:'tabSummaryRisks',
        layout:'anchor',
        items:[
               {
                  xtype:'qrm-SummaryPanel',
                  anchor:'100% 100%'
                  }
               ]
    }, {
        title: "Risk Ranking",
        id:'tabRanking',
        layout:'border',
        items:[{
           xtype: 'qrm-rankWindow',
           region: 'center'
       }, {
           xtype: 'qrm-rankInfo',
           region: 'west',
           width: 200

        }],
        dockedItems: [{
           xtype: 'toolbar',
           dock: 'bottom',
           ui: 'footer',
           items: [ "Ctrl-Click to open risk",{
              xtype: 'component',
              flex: 1                    
           }, {
               text: 'Cancel Changes',
               width: 110,
               handler: function () {
                   QRM.app.getRankingController().loadGrid();
                   QRM.app.getRankingController().dirty = false;
               }
           }, {
               text: 'Save Changes',
               width: 110,
               handler: function () {
                   QRM.app.getRankingController().saveChanges();
               }
           }, {
               text: 'Export Chart',
               width: 110,
               handler: function () {
                  exportSVG('subRankSVGDiv');
               }
           }]
       }]
    }, {
       id: "tabMatrix",
       title: "Relative Matrix",
       layout: 'border',
       items: [{
           xtype: 'qrm-relMatrixWindow',
           region: 'center',
           layout: 'anchor',
           id:'matwinid'
       }, {
           xtype: 'qrm-relMatrixSelector',
           region: 'west',
           width: 200
       }],
       dockedItems: [{
          xtype: 'toolbar',
          dock: 'bottom',
          ui: 'footer',
          items: [
                  "Ctrl-Click to open risk",
                  {
                     xtype: 'component',
                     flex: 1                    
                  },
                   {
              text: 'Cancel Changes',
              width: 110,
              id:'qrm-RelMatCancelChangesBtn'
              
          }, {
              text: 'Save Changes',
              width: 110,
              id:'qrm-RelMatSaveChangesBtn'
          }, {
              text: 'Export Chart',
              width: 110,
              handler: function () {
                 exportSVG('relMatrixSVGDiv');
              }
          }]
      }]
    }, {
        id: "tabAnalysis",
        title: "Analysis",
        layout: 'border',
        items: [{
            xtype: 'qrm-analysisWindow',
            region: 'center',
            layout: 'anchor'
        }, {
            xtype: 'qrm-analysisSelector',
            region: 'west',
            width: 200
        }],         
         dockedItems: [{
           xtype: 'toolbar',
           dock: 'bottom',
           ui: 'footer',
           items: [
                   "Click any item or legend on right (if present)",
                   {
                      xtype: 'component',
                      flex: 1                    
                   }, {
               text: 'Export Chart',
               width: 110,
               handler: function () {
                  $$('qrmID-analysisWindow').down('chart').save({
                     type: 'image/png'
                  });
               }
           }]
       }]

    }, {
        title: "Reviews",
        id:'tabReviews',
        layout: 'border',
        items: [ {
           xtype: 'panel',
           region: 'center',
           layout: 'anchor',
           border: false,
           items: [{
               xtype: 'qrm-review-grid',
               anchor: '100% 100%',
               border: false
           }]
       }]
        
     }, {
        id: "tabReport",
        title: "Reports",
        layout:'border',
        items:[{
           xtype : 'qrm-reportpanel',
           region : 'center'
        }]
           
    }]
});