/**
 * 
 */

Ext.define('QRM.view.relmatrix.RelMatrixItem', {
    xtype: 'qrm-relMatrixItem',
    extend: "Ext.panel.Panel",
    header: false,
    floating: true,
    draggable: true,
    layout:'fit',
    height: 30,
    width: 60,

    //QRM Specific
    initImpact: 1,
    initProb: 1,
    treatedImpact: 1,
    treatedProb: 1,
    untreatedImpact: 1,
    untreatedProb: 1,
    newTreatedImpact: 1,
    newTreatedProb: 1,
    newUntreatedImpact: 1,
    newUntreatedProb: 1,
    treated:true,
    clean: true,
    treatedClean: true,
    untreatedClean: true,
    ignoreMove:true,
    layoutConfig : {
       pack : 'center',
     align : 'middle'
   },
    listeners: {
       el: {
           mouseover: function () {
              var panel = Ext.getCmp(this.id);
              Ext.WindowManager.bringToFront(panel);
              var html = "<div style='valign:top'><br><hr><strong>" + panel.riskCode + " - " + panel.riskTitle + "<br><br>Description:<br><br></strong>" + panel.description.substring(0, 500) + "<hr></div>";
              Ext.getCmp('qrm-RelMatSelectorDetail').update(html);
           },
           mouseout: function () {
              Ext.getCmp('qrm-RelMatSelectorDetail').update("");
           },
    
           }
       },

    dragRepositionStop: function (state) {
        this.clean = false;

        if (state == 0) {
            if (this.riskTreated) {
                this.updateTreated();
            } else {
                this.updateUntreated();
            }
        }
        if (state == 1) {
            this.updateUntreated();
        }
        if (state == 2) {
            this.updateTreated();
        }
        return true;
    },
    updateTreated: function () {
        this.treatedClean = false;
        this.newTreatedImpact = this.calcImpact();
        this.newTreatedProb = this.calcProb();
    },
    updateUntreated: function () {
        this.untreatedClean = false;
        this.newUntreatedImpact = this.calcImpact();
        this.newUntreatedProb = this.calcProb();
    },
    calcProb: function () {
        var RelMatrixImg = Ext.getCmp('matwinid');
        var y = this.getY() - RelMatrixImg.getY();
        var yUnits = (RelMatrixImg.getHeight() - 30) / (QRM.global.project.matrix.maxProb);
        return (QRM.global.project.matrix.maxProb + 1) - (y / yUnits);
    },
    calcImpact: function () {
       var RelMatrixImg = Ext.getCmp('matwinid');
        var x = this.getX() - RelMatrixImg.getX();
        var xUnits = (RelMatrixImg.getWidth() - 60) / (QRM.global.project.matrix.maxImpact);
        return (x / xUnits) + 1;
    },
    filter: function () {
        var owner = riskOwnerSelectItem.getValue();
        var manager = riskManagerSelectItem.getValue();
        if ((owner == null || owner == this.riskOwner) && (manager == null || manager == this.riskManager)) {
            this.show();
        } else {
            this.hide();
        }
    },
    findRisk: function () {
        if (relMatrixRiskLocatorSelectItem.getValue() == this.riskCode && this.isVisible()) {
            this.setBackgroundColor("gray");
            this.bringToFront();
            this.resizeBy(10, 10);
            this.moveBy(-5, -5);
            this.highlighted = true;
            return true;
        }
        return false;
    },
    resetClass: function () {
        if (this.highlighted) {
            this.resizeBy(-10, -10);
            this.moveBy(5, 5);
            this.setBackgroundColor("white");
            this.highlighted = false;
        }
    }

});