/**
 * Define the form for entering consequnces data
 */


Ext.define('QRM.view.editor.ConsequenceWidget', {
   extend:'Ext.form.Panel',
   xtype:"qrmXType-ConsequenceWidget",
   border: false,
   width: 340,
   imgID:null,
   preMit:false,
   hideEmptyLabel: false,
   clearQRMForm:function(){
      var form = this.getForm();
      
      form.findField('mean').setValue(0);
      form.findField('stdDev').setValue(0);
      form.findField('min').setValue(0);
      form.findField('max').setValue(0);
      form.findField('most').setValue(0);
      form.findField('lower').setValue(0);
      form.findField('upper').setValue(0);
      form.findField('simple').setValue(0);
      
      form.findField('probability').setValue(100);
      form.findField('distType').setValue("au.com.quaysystems.qrm.util.probability.NormalDistribution");      
   },
   setQRMValues:function(prob, type,params){
      var form = this.getForm();
      
      form.findField('mean').setValue(params[0]);
      form.findField('stdDev').setValue(params[1]);
      form.findField('min').setValue(params[2]);
      form.findField('max').setValue(params[3]);
      form.findField('most').setValue(params[4]);
      form.findField('lower').setValue(params[5]);
      form.findField('upper').setValue((params[6])?params[6]:0);
      form.findField('simple').setValue((params[7])?params[7]:0);
      
      form.findField('probability').setValue(prob);
      form.findField('distType').setValue(type);
   },
   fieldDefaults: {
       labelAlign: 'right',
       labelWidth: 140,
       xtype: 'numberfield',
       enableKeyEvents: true
   },
   layout: {
       type: 'vbox',
       padding: '10 20 30 10',
       align: 'stretch' // Child items are stretched to full width
   },
   items: [{
       xtype: 'numberfield',
       fieldLabel: '% Probability',
       minValue:0,
       maxValue:100,
       value:100,
       name: 'probability'
   }, {
       xtype: 'combobox',
       fieldLabel: 'Distribution Type',
       forceSelection: true,
       displayField: 'name',
       name: 'distType',
       valueField: 'type',
       allowBlank: true,
       queryMode: 'local',
       store: Ext.create('Ext.data.SimpleStore', {
          id:0,
           fields: ['type', 'name'],
           data:[
                 ["au.com.quaysystems.qrm.util.probability.NormalDistribution", "Normal"],
                 ["au.com.quaysystems.qrm.util.probability.TruncNormalDistribution", "Truncated Normal"],
                 ["au.com.quaysystems.qrm.util.probability.TriangularDistribution", "Triangular"],
                 ["au.com.quaysystems.qrm.util.probability.TriGenDistribution", "Truncated Triangular"],
                 ["au.com.quaysystems.qrm.util.probability.SimpleDistribution", "Simple"],
                 ["au.com.quaysystems.qrm.util.probability.UniformDistribution", "Uniform"],
                 ["au.com.quaysystems.qrm.util.probability.DiscreteDistribution", "Discrete"],
                 ["au.com.quaysystems.qrm.util.probability.NullDistribution", "No Distribution Defined"]
                 ]
        })
   }, {
       xtype: 'numberfield',
       fieldLabel: "Mean",
       name:"mean",
       hidden:true,
       minValue: 0
   }, {
       xtype: 'numberfield',
       fieldLabel: "Std. Deviation",
       name:'stdDev',
       hidden:true,
       minValue: 0
   }, {
       xtype: 'numberfield',
       fieldLabel: "Minimum",
       name:'min',
       hidden:true,
       minValue: 0
   }, {
       xtype: 'numberfield',
       fieldLabel: "Most Likely",
       name:'most',
       hidden:true,
       minValue: 0
   }, {
       xtype: 'numberfield',
       fieldLabel: "Maximun",
       name:'max',
       hidden:true,
       minValue: 0
   }, {
       xtype: 'numberfield',
       fieldLabel: "Lower Limit",
       name:'lower',
       hidden:true,
       minValue: 0
   }, {
       xtype: 'numberfield',
       fieldLabel: "Upper Limit",
       name:'upper',
       hidden:true,
       minValue: 0
   }, {
      xtype: 'numberfield',
      fieldLabel: "Value",
      name:'simple',
      hidden:true,
      minValue: 0
   }]
});