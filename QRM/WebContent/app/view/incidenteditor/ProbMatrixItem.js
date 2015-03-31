/**
 * 
 */

Ext.define('QRM.view.editor.ProbMatrixItem', {
    extend: "Ext.panel.Panel",
    xtype:'qrmXType-riskEditorProbMatrixItem',
    header: false,
    floating: true,
    draggable: true,
    alwaysOnTop:true,
    layout:'fit',
    height: 30,
    width: 60,
    clean: true,
    hostImg: null,
    prob:0,
    impact:0,
    percentProb:0,
    percentImpact:0,
    propProb:0,
    propImpact:0,
    maxProb:0,
    maxImpact:0,
    xpos:0,
    ypos:0,
    html:"ITEM",
    treated:false,
    layoutConfig : {
       pack : 'center',
       align : 'middle'
   },
   init:function(host, maxprob,maximpact, prob, impact){
      
     this.clear();
     this.hostImg = host;
     this.maxProb = maxprob;
     this.maxImpact = maximpact;
     this.prob = prob;
     this.impact = impact;
     
     this.propProb = (this.prob - 1)/this.maxProb;
     this.propImpact = (this.impact - 1)/this.maxImpact;
     
     this.percentProb = this.propProb*100;
     this.percentImpact = this.propImpact*100;
     
   },
   clear:function(){
      this.xpos = 0;
      this.ypos = 0;
      this.ignoreMove = true;
      this.prob = 0;
      this.impact = 0;
      this.propImpact = 0;
      this.propProb = 0;
      this.percentImpact = 0;
      this.percentProb = 0;
   },
   calcProbImpactFromPostion:function(){
      
     var Xe = this.getX();
     var Ye = this.getY();

     var Xn = Xe - this.hostImg.getX();
     var Yn = Ye - this.hostImg.getY();
     
     var w = this.hostImg.width-this.width;
     var h = this.hostImg.height-this.height;
     
     this.propImpact = Xn/w;
     this.propProb = 1 - Yn/h;
     
     this.percentImpact = this.propImpact*100;
     this.percentProb = this.propProb*100;
     
     this.impact = this.maxImpact*this.propImpact + 1;
     this.prob = this.maxProb*this.propProb + 1;

   },
   setProbPercentage:function(prob){
      
     this.percentProb = prob;
     this.propProb = prob/100;
     this.prob = this.maxProb*this.propProb + 1;
     
     this.calcXYPosition();


   },
   setProbImpact:function(prob, impact){
      
     this.prob = prob;
     this.impact = impact;
     
     this.propProb = (this.prob - 1)/this.maxProb;
     this.propImpact = (this.impact - 1)/this.maxImpact;
     
     this.percentProb = this.propProb*100;
     this.percentImpact = this.propImpact*100;
     
     this.calcXYPosition();

   },
   calcXYPosition: function(){
      
      // Width and Height of the actual matrix
      var w = this.hostImg.width-this.width;
      var h = this.hostImg.height-this.height;

      // NOrmalised centre of the item relative to the origin of the matrix
      var Xn = this.propImpact * w;
      var Yn = (1 - this.propProb) * h;
      
      // Origin of the Matrix Image
      var Xo = this.hostImg.getX();
      var Yo = this.hostImg.getY();

      //Absolute posiiton of centre of the item
      var Xc = Xo+(this.width*0.5)+Xn;
      var Yc = Yo+(this.height*0.5)+Yn;

      //Absolute position of the top left corner of the item
      this.xpos = Xc - (this.width*0.5);
      this.ypos = Yc - (this.height*0.5);
   },
   checkBounds:function(x,y){
      
      var Xo = this.hostImg.getX();
      var Yo = this.hostImg.getY();
      
      this.xpos = Math.max(x, Xo);
      this.xpos = Math.min(this.xpos, Xo+240);
      
      this.ypos = Math.max(y, Yo);
      this.ypos = Math.min(this.ypos, Yo+270);
     
      this.showItem();
      this.calcProbImpactFromPostion();
                  
   },
   showItem:function(){
      this.setPosition(this.xpos, this.ypos);
      this.show();
   }
});