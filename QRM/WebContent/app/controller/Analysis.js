/**
 * 
 */
Ext.define('QRM.controller.Analysis', {
   extend: 'Ext.app.Controller',
   views: ['analysis.AnalysisSelector','analysis.AnalysisWindow'],
   loadTrigger:"TabSwitch",
   init: function() {
      this.control(
            {'#qrm-AnalysisSelectorGrid': {
               itemclick: this.gridItemSelected
            }
            });
      this.control(
            {'#qrm-AnalysisSelectorConfig checkboxfield': {
               change: this.updateChart
            }
            });
      this.control(
            {
               '#numAnalRecords':{
                  change:this.gridItemSelected
               }
            });
   },

   updateChart : function(){
       
      var record = $$('qrm-AnalysisSelectorGrid').getSelectionModel().getSelection()[0];
      var item = record.raw;
      var chart = null;
      if (item.toleranceChart){
         chart = this.getStackedBarChart(record);
      } else if (item.riskChart){
         
         var data = null;
         analysisToolStore.data.items.forEach(function (it){
            if (it.raw.hasRiskData){
               data = it.raw.data;
            }
         });
         
         chart = this.getRiskChart(record, data);
      }
      
     $$('qrmID-analysisWindow').removeAll(true);
     $$('qrmID-analysisWindow').insert(1,chart);
     $$('qrmID-analysisWindow').doLayout();

   },
   
  getRiskChart: function(record, data){
     var item = record.raw;
     var sortedData;
      
      // Sort highest to lowest
     sortedData= data.sort(function (a,b){
         return b[item.riskField]-a[item.riskField];
      });

     // Reverse the sort for lowest to highest
      if ($$('cbAnalReverse').getValue()){
         sortedData = sortedData.reverse();
      }

      if(item.selectNumber){
         var num = $$('numAnalRecords').getValue();
         num = Math.min(sortedData.length,num);
         sortedData = sortedData.slice(0,num);            
      }
      
      //Reverse the order so it displays correctly
      sortedData = sortedData.reverse();

      var store = Ext.create('Ext.data.JsonStore', {
         fields: ["name", item.riskField],
         data: sortedData
     });
      
      var title =  QRM.global.project.projectTitle;
      if($$('cbDescendants').value){
         title = title+" and Sub Projects";
      }
     var chart = Ext.create('Ext.ux.chart.TitleChart',{
             anchor:"100% 100%",
             animate: true,
             shadow: true,
             store: store,
             title:title+" - "+item.title,
             titleLocation:'top',
             titleFont:'18px sans-serif',
             titlePadding: 5,
             titleMargin: 5,
             axes: [{
                 title:item.xaxisTitle,
                 type: 'Numeric',
                 position: 'bottom',
                 fields: [item.riskField],
             }, {
                 title:item.yaxisTitle,
                 type: 'Category',
                 position: 'left',
                 fields: ['name']
             }],
             series: [{
                 type: 'bar',
                 axis: 'bottom',
                 gutter: 80,
                 xField: 'year',
                 yField: [item.riskField],
                 stacked: true,
                 listeners:{
                   'itemclick':function(me){
                      eval(item.clickFunction);
                   } 
                 },
                 tips: {
                     trackMouse: true,
                     width: 65,
                     height: 28,
                     renderer: function(storeItem, it ){
                         this.setTitle(it.value[1]);
                     }
                 }
             }]
         });
     
     return chart;

   },

   getStackedBarChart: function(record){
      
      var item = record.raw;
      var sortedData;

      sortedData =  record.raw.data.sort(function (a,b){
         return (a.Extreme+a.High+a.Significant+a.Moderate+a.Low)-(b.Extreme+b.High+b.Significant+b.Moderate+b.Low);
      });

      if ($$('cbAnalReverse').getValue()){
         sortedData.reverse();         
      }
      var store = Ext.create('Ext.data.JsonStore', {
         fields: ['name', 'Extreme', 'High', 'Significant', 'Moderate', 'Low'],
         data: sortedData
     });
      
      Ext.chart.theme.Browser = Ext.extend(Ext.chart.theme.Base, {
          constructor: function(config) {
              Ext.chart.theme.Base.prototype.constructor.call(this, Ext.apply({
                  colors: ['rgb(255,0,0)',
                           'rgb(255,165,0)',
                           'rgb(255,255,0)',
                           'rgb(0,255,0)',
                           'rgb(0,255,255)',
                           'rgb(40, 40, 40)']
              }, config));
          }
      });

      var title =  QRM.global.project.projectTitle;
      if($$('cbDescendants').value){
         title = title+" and Sub Projects";
      }
      
     var chart = Ext.create('Ext.ux.chart.TitleChart',{
             anchor:"100% 100%",
             animate: true,
             shadow: true,
             store: store,
             theme: 'Browser',
             title:title+" - "+item.title,
             titleLocation:'top',
             titleFont:'18px sans-serif',
             titlePadding: 5,
             titleMargin: 5,
             legend: {
                 position: 'right'
             },
             axes: [{
                 type: 'Numeric',
                 position: 'bottom',
                 fields: ['Extreme', 'High', 'Significant', 'Moderate', 'Low'],
                 title: item.xaxisTitle
             }, {
                 type: 'Category',
                 position: 'left',
                 fields: ['name'],
                 title: item.yaxisTitle
             }],
             series: [{
                 type: 'bar',
                 axis: 'bottom',
                 gutter: 80,
                 yField: ['Extreme', 'High', 'Significant', 'Moderate', 'Low'],
                 stacked: true,
                 listeners:{
                    'itemclick':function(me){
                        debugger;
                        eval(item.clickFunction);
                    } 
                  },

                 tips: {
                     trackMouse: true,
                     width: 65,
                     height: 28,
                     renderer: function(storeItem, it ){
                         this.setTitle(it.value[1]);
                     }
                 }
             }]
         });
     
     return chart;

   },

   gridItemSelected : function(grid, record,item){
      this.updateChart();
   },
   okToSwitchProject: function(){
      return true;
   },
   okToSwitchTab: function(){
      return true;
   },
   resizePanel:function(){
      this.updateChart();
   },
   switchTab: function(){
      
      analysisToolStore.load({
         params: {
            "DESCENDANTS": $$('cbDescendants').value,
            "PROJECTID": QRM.global.projectID,
            "PROCESSFILTER": false
         },
         callback:function(records, operation, success){
            var index = getRandomInt(0, this.getTotalCount());
            var selectionModel = $$('qrm-AnalysisSelectorGrid').getSelectionModel();
            selectionModel.select(index);
            QRM.app.getAnalysisController().updateChart();
         }
      });
   },
   switchProject : function(project, desc){
      var index = analysisToolStore.indexOf($$('qrm-AnalysisSelectorGrid').getSelectionModel().getSelection()[0]);
      analysisToolStore.load({
         params: {
            "DESCENDANTS": $$('cbDescendants').value,
            "PROJECTID": QRM.global.projectID,
            "PROCESSFILTER": false
         },
         callback:function(records, operation, success){
             $$('qrm-AnalysisSelectorGrid').getSelectionModel().select(index);
            QRM.app.getAnalysisController().updateChart();
         }
      });      
   },
   updateAnalDetails: function (recParam) {

      var rec = recParam;
      if (rec == null) {
         rec = $$('qrm-AnalysisSelectorGrid').getSelectionModel().getSelection()[0].data;
      }

      if (rec) {
         try {

            var key = Math.random();

            Ext.Ajax.request({
               url: "./getAnalChart",
               params: {
                  "class": rec.clazz,
                  "param1": rec.param1,
                  "num": $$('numAnalRecords').getValue(),
                  "b3D": $$('cbAnal3D').value,
                  "bReverse": $$('cbAnalReverse').value,
                  "bEx": $$('cbAnalExtreme').value,
                  "bHigh": $$('cbAnalHigh').value,
                  "bSig": $$('cbAnalSignificant').value,
                  "bMod": $$('cbAnalModerate').value,
                  "bLow": $$('cbAnalLow').value,
                  "x": $$('qrm-RiskAnalysisPanel').getWidth(),
                  "y": $$('qrm-RiskAnalysisPanel').getHeight(),
                  "bDescend": $$('cbDescendants').value,
                  "contextID": QRM.global.projectID,
                  "map": true,
                  "nocache": key
               },
               success: function(response){

                  var data = Ext.JSON.decode(response.responseText);
                  var html = "<img style=\"border-width:0px;border-style:none;\" usemap=\"#imageMap_" + key + "\" src=\"/getAnalChart?image=true&nocache=" + key + 1 + "\">";
                  html = html + data;
                  $$('qrm-RiskAnalysisPanel').update(html);    
               }
            });
         } catch (err) {
            alert("Update Analysis Detail " + err.message);
         }
      }
   },
   updateAnalOptions: function (rec) {

      return;


   }  
});