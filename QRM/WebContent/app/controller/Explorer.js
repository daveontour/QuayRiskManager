Ext.define('QRM.controller.Explorer', {
    extend: 'Ext.app.Controller',
    views: ['explorer.FilterPanel',
            'explorer.RiskExplorerGrid',
            'explorer.MonteWindow',
            'explorer.ContingencyWindow',
            'explorer.NewRiskWindow',
            'explorer.ImportRiskFileWindow',
            'explorer.SelectXMLRisksWindow'],
            
    stores: ['Explorer'],
    models: ['LiteRisk', 'Person'],
    suspendFilterPanelListener: false,
    monteWindow: null,
    newRiskWindow: null,
    contingencyWindow: null,
    importRiskFileWindow:null,
    selectXMLRisksWindow:null,
    projectSwitch:true,
    init: function () {
        this.control({
            'qrm-filterpanel checkboxfield': {
                change: this.filterPanelChanged
            }
        });
        this.control({
            '#clearFilterBtn': {
                click: this.handleResetFilterPanel
            }
        });
        this.control({
            '#txtRiskCode': {
                keypress: this.handleRiskCodeKeyPress
            }
        });
        this.control({
            '#comboRiskOwner': {
                select: this.filterPanelChanged
            }
        });
        this.control({
            '#comboRiskManager': {
                select: this.filterPanelChanged
            }
        });
        this.control({
            '#comboCategory': {
                select: this.filterPanelChanged
            }
        });
        this.control({
            'qrm-explorer-grid': {
                itemdblclick: this.openRisk
            }
        });
        this.control({
            '#qrmID-riskGridNewRiskBtn': {
                click: this.newRisk
            }
        });
        this.control({
            '#qrmID-riskGridDeleteRiskBtn': {
                click: this.deleteRisk
            }
        });
        this.control({
            '#qrmID-riskGridMonteBtn': {
                click: this.runMonte
            }
        });
        this.control({
            '#qrmID-submitMonteBtn': {
                click: this.submitMonte
            }
        });
        this.control({
            '#qrmID-riskGridExportBtn menuitem': {
                click: this.exportSelection
            }
        });
        this.control({
            '#qrmID-riskGridUnpromoteBtn': {
                click: this.unpromoteRisk
            }
        });
        this.control({
            '#qrmID-riskGridProjectContingencyBtn': {
                click: this.updateProjectContingency
            }
        });
        this.control({
            '#qrmID-submitContingencyBtn': {
                click: this.submitUpdateProjectContingency
            }
        });


        this.control({
            '#qrmID-explorerGridDetailViewBtn': {
                click: this.gridDetailView
            }
        });
        this.control({
            '#qrmID-explorerGridAuditViewBtn': {
                click: this.gridAuditView
            }
        });
        this.control({
            '#qrmID-explorerGridSummaryViewBtn': {
                click: this.gridSummaryView
            }
        });
        this.control({
           '#qrmID-submitNewRiskBtn': {
               click: this.submitNewRisk
           }
       });
        this.control({
           '#qrm-SummaryRiskNewBtnID': {
               click: this.newSummaryRisk
           }
       });
        this.control({
           '#qrmID-riskGridImportBtn': {
               click: this.importRiskSelectFile
           }
       });
        this.control({
           '#qrmID-ImportRiskImportBtn': {
               click: this.importSelectedXMLRisks
           }
       });
                
        
                     

    },
    importRiskSelectFile: function () {
        if (this.importRiskFileWindow == null) {
          this.importRiskFileWindow = Ext.create('QRM.view.explorer.ImportRiskFileWindow');
      }

       this.importRiskFileWindow.show();

    },

    newRisk: function () {
       if (this.newRiskWindow == null) {
          this.newRiskWindow = Ext.create('QRM.view.explorer.NewRiskWindow');
      }

      $$('qrm-NewRiskEditorDataForm2').getForm().reset(); 
      $$('qrm-NewRiskEditorDataForm1').getForm().reset(); 
      
      $$('qrmID-NewRiskEditorPropogateTypeGroup').setDisabled(true);
      $$('qrmID-NewRiskEditorSummaryRisk').setDisabled(false);
      $$('qrmID-NewRiskEditorSummaryRisk').setValue(false);
      $$('qrmID-NewRiskEditorPropogatedRisk').setDisabled(false);
      $$('qrmID-NewRiskEditorPropogatedRisk').setValue(false);

      this.newRiskWindow.summaryOnly = false;

      this.newRiskWindow.show();

    },
    newSummaryRisk: function () {
        if (this.newRiskWindow == null) {
          this.newRiskWindow = Ext.create('QRM.view.explorer.NewRiskWindow');
      }

      $$('qrm-NewRiskEditorDataForm2').getForm().reset(); 
      $$('qrm-NewRiskEditorDataForm1').getForm().reset(); 

      $$('qrmID-NewRiskEditorPropogateTypeGroup').setDisabled(true);
      $$('qrmID-NewRiskEditorPropogatedRisk').setDisabled(true);
      $$('qrmID-NewRiskEditorPropogatedRisk').setValue(false);
      $$('qrmID-NewRiskEditorSummaryRisk').setDisabled(true);
      $$('qrmID-NewRiskEditorSummaryRisk').setValue(true);
      
      this.newRiskWindow.summaryOnly = true;
      
      this.newRiskWindow.show();

    }, 
    submitNewRisk:function(){
       
       if (!$$('qrm-NewRiskEditorDataForm1').getForm().isValid()) return;
       if (!$$('qrm-NewRiskEditorDataForm2').getForm().isValid()) return;

       var values = merge_options($$('qrm-NewRiskEditorDataForm1').getForm().getValues(),
             $$('qrm-NewRiskEditorDataForm2').getForm().getValues());
       
       values.projectID = QRM.global.projectID;
       if (values.ownerID == null){
          values.ownerID = QRM.global.userID;
       }
       if (values.manager1ID == null){
          values.manager1ID = QRM.global.userID;
       }
       if (values.summaryRisk == 'on' || this.newRiskWindow.summaryOnly){
          values.summaryRisk = true;
       } else {
          values.summaryRisk = false;          
       }

 
       var newRiskURL = "./newRisk";

          if (values.forceDownRisk) {
             newRiskURL = "./newForceDownRisk";
          }
          
          Ext.Ajax.request({
             url: newRiskURL,
             scope:this,
             params: {
                "DATA": JSON.stringify(values)
             },
             success: function (response) {
               if(values.forceDownRisk){
                   msgLeft("New Risk","Risk assigned ID: " + Ext.decode(response.responseText));
                } else {
                   msg("New Risk","Risk assigned ID: " + Ext.decode(response.responseText));
                }
                QRM.app.getExplorerController().newRiskWindow.close();
                
                if(this.newRiskWindow.summaryOnly){
                   QRM.app.getSummaryRisksController().switchProject(QRM.global.projectID, $$('cbDescendants').value);                   
                } else {
                   QRM.app.getExplorerController().populateGrid(QRM.global.projectID, $$('cbDescendants').value);
                }
                QRM.global.riskID = 0;
             }
          });

    },
    gridAuditView: function () {
       
       QRM.global.viewState = 'Audit';

       var me = this;
        $$('qrmID-RiskTable').reconfigure($$('qrmID-RiskTable').store,[{
            text: 'Risk Code',
            width: 85,
            dataIndex: 'riskProjectCode',
            locked: true,
            tdCls: 'x-change-cell',
            renderer: function (value, metaData, model, row, col, store, gridView) {
                var record = model.data;
                if (record.summaryRisk && record.promotionCode != "-") {
                    return value + "* (" + record.toProjCode + ")";
                } else if (record.promotionCode != "-") {
                    return value + " (" + record.toProjCode + ")";
                } else if (record.summaryRisk) {
                    return value + "*";
                } else {
                    return value;
                }
            }
        }, {
            text: 'Title',
            flex: 1,
            dataIndex: 'title'
        },{
          text:"Identification",
          columns:[
                   {
                      text:"Reviewed",
                      align:'center',
                      dataIndex:"dateIDRev",
                      renderer: function (value, metaData, model, row, col, store, gridView) {
                         return me.renderAuditCell(value, metaData, model, row, col, store, gridView);
                      }
                   },
                   {
                      text:"Approved",
                      align:'center',
                      dataIndex:"dateIDApp",
                      renderer: function (value, metaData, model, row, col, store, gridView) {
                         return me.renderAuditCell(value, metaData, model, row, col, store, gridView);
                      }
                   }
                   ]
        },{
           text:"Evaluation",
           columns:[
                    {
                       text:"Reviewed",
                       align:'center',
                       dataIndex:"dateEvalRev",
                       renderer: function (value, metaData, model, row, col, store, gridView) {
                          return me.renderAuditCell(value, metaData, model, row, col, store, gridView);
                       }
                    },
                    {
                       text:"Approved",
                       align:'center',
                       dataIndex:"dateEvalapp",
                       renderer: function (value, metaData, model, row, col, store, gridView) {
                          return me.renderAuditCell(value, metaData, model, row, col, store, gridView);
                       }
                    }
                    ]
         },{
            text:"Mitigation",
            columns:[
                     {
                        text:"Reviewed",
                        align:'center',
                        dataIndex:"dateMitRev",
                        renderer: function (value, metaData, model, row, col, store, gridView) {
                           return me.renderAuditCell(value, metaData, model, row, col, store, gridView);
                        }
                     },
                     {
                        text:"Approved",
                        align:'center',
                        dataIndex:"dateMitApp",
                        renderer: function (value, metaData, model, row, col, store, gridView) {
                           return me.renderAuditCell(value, metaData, model, row, col, store, gridView);
                        }
                     }
                     ]
          },
        {
            text: 'Treated',
            align: 'center',
            width: 70,
            dataIndex: 'treated',
            renderer: function (value, metaData, record, row, col, store, gridView) {
                if (value) {
                    return "<img src='/images/tick.png'></img>";
                } else {
                    return "<img src='/images/action_stop.gif'></img>";
                }
            }
        }]);
        
        QRM.app.getMainTabsController().getProject(QRM.global.projectID);
    },
    renderAuditCell: function(value, meta, model, row, col, store, gridView){
       if (value == null){
          meta.style = "background-color:#FF9999;";
          return;
       } else {
          meta.style = "background-color:#99FF99;";
          return this.renderDate(value);
       }
    },
    renderDate:Ext.util.Format.dateRenderer('d M Y'),
    
    gridDetailView: function () {
       
       QRM.global.viewState = 'Detail';

        $$('qrmID-RiskTable').reconfigure($$('qrmID-RiskTable').store,[{
           text: 'Risk Code',
           width: 85,
           dataIndex: 'riskProjectCode',
           locked: true,
           tdCls: 'x-change-cell',
           renderer: function (value, metaData, model, row, col, store, gridView) {
               var record = model.data;
               if (record.summaryRisk && record.promotionCode != "-") {
                   return value + "* (" + record.toProjCode + ")";
               } else if (record.promotionCode != "-") {
                   return value + " (" + record.toProjCode + ")";
               } else if (record.summaryRisk) {
                   return value + "*";
               } else {
                   return value;
               }
           }
       }, {
           width: 50,
           align: 'center',
           locked: true,
           dataIndex: 'currentTolerance',
           renderer: function (value, metaData, record, row, col, store, gridView) {
               return "<img src='/images/tol" + value + ".png'></img>";
           }
       }, {
           text: 'Title',
           flex: 1,
           dataIndex: 'title'
       }, {
           text: 'Owner',
           align: 'center',
           width: 130,
           dataIndex: 'ownerName'
       }, {
           text: 'Manager',
           align: 'center',
           width: 130,
           dataIndex: 'manager1Name'
       }, {
           text: 'Treated',
           align: 'center',
           width: 70,
           dataIndex: 'treated',
           renderer: function (value, metaData, record, row, col, store, gridView) {
               if (value) {
                   return "<img src='/images/tick.png'></img>";
               } else {
                   return "<img src='/images/action_stop.gif'></img>";
               }
           }
       }]);
        
        QRM.app.getMainTabsController().getProject(QRM.global.projectID);

    },
    gridSummaryView: function () {
       
       QRM.global.viewState = 'Rolled';

       $$('qrmID-RiskTable').reconfigure($$('qrmID-RiskTable').store,[{
          text: 'Risk Code',
          width: 85,
          dataIndex: 'riskProjectCode',
          locked: true,
          tdCls: 'x-change-cell',
          renderer: function (value, metaData, model, row, col, store, gridView) {
              var record = model.data;
              if (record.summaryRisk && record.promotionCode != "-") {
                  return value + "* (" + record.toProjCode + ")";
              } else if (record.promotionCode != "-") {
                  return value + " (" + record.toProjCode + ")";
              } else if (record.summaryRisk) {
                  return value + "*";
              } else {
                  return value;
              }
          }
      }, {
          width: 50,
          align: 'center',
          locked: true,
          dataIndex: 'currentTolerance',
          renderer: function (value, metaData, record, row, col, store, gridView) {
              return "<img src='/images/tol" + value + ".png'></img>";
          }
      }, {
          text: 'Title',
          flex: 1,
          dataIndex: 'title'
      }, {
          text: 'Owner',
          align: 'center',
          width: 130,
          dataIndex: 'ownerName'
      }, {
          text: 'Manager',
          align: 'center',
          width: 130,
          dataIndex: 'manager1Name'
      }, {
          text: 'Treated',
          align: 'center',
          width: 70,
          dataIndex: 'treated',
          renderer: function (value, metaData, record, row, col, store, gridView) {
              if (value) {
                  return "<img src='/images/tick.png'></img>";
              } else {
                  return "<img src='/images/action_stop.gif'></img>";
              }
          }
      }]);
       
       QRM.app.getMainTabsController().getProject(QRM.global.projectID);

   },
    submitUpdateProjectContingency: function () {
        Ext.Ajax.request({
            scope: this,
            url: "./updateProjectContingency",
            params: {
                "PROJECTID": QRM.global.projectID,
                    "DESCENDANTS": $$('cbDescendants').value,
                    "PERCENTILE": $$('qrmID-riskGridContingencyPercentileBtn').getValue()
            },
            success: function (response) {
                msg("Update Project Contingency", "Project Contingency Updated");
                this.populateGrid(QRM.global.projectID, $$('cbDescendants').value);
            }
        });
        this.contingencyWindow.close();
    },
    updateProjectContingency: function () {
        if (this.contingencyWindow == null) {
            this.contingencyWindow = Ext.create('QRM.view.explorer.ContingencyWindow');
        }
        this.contingencyWindow.show();
        $$('qrmID-contingencyConfigForm').getForm().reset();

    },
    exportSelection: function (item) {

        if (item.type == "EXCEL") {
            msg("Export to Excel", "Please use desired report to export into MS Excel format");
            return;
        }

        if (!checkExplorerSelection()) {
            msg("Export Risks", "Please select the risk you wish to export");
            return;
        }

        var form = Ext.DomHelper.append(
        document.body, {
            tag: 'form',
            method: 'post',
            action: './QRMMSFormat',
            children: [{
                tag: 'input',
                type: 'hidden',
                name: 'DATA',
                value: JSON.stringify(getExplorerRiskIDs())
            }, {
                tag: 'input',
                type: 'hidden',
                name: 'OPERATION',
                value: item.type
            }]
        });
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    },

    unpromoteRisk: function () {

        var riskIDs = getExplorerRiskIDs();
        if (riskIDs.length < 1) {
            msg("Remove Risk Promotion", "Please select at least one risk");
            return
        }
        Ext.Ajax.request({
            url: "./unpromoteRisks",
            scope: this,
            params: {
                "DATA": JSON.stringify(riskIDs),
                    "PROJECTID": QRM.global.projectID
            },
            success: function (response) {
                msg("Remove Risk Promotion", response.responseText);
                this.populateGrid(QRM.global.projectID, $$('cbDescendants').value);
            }
        });
    },

    submitMonte: function () {
        var values = $$('qrmID-monteConfigForm').getForm().getValues();
        values.simType = 0;
        values.iterations = Math.max(values.iterations, 5000);
        values.riskIDs = getExplorerRiskIDs();

        if (values.start.length < 1 || values.end.length < 1) {
            msg("Submit Monte Carlo Request", "Please enter a simulation start and end date");
            return;
        }
        Ext.Ajax.request({
            url: "./submiteMonteRequest",
            params: {
                "DATA": JSON.stringify(values),
                    "PROJECTID": QRM.global.projectID
            },
            success: function (response) {
                var jobID = Ext.decode(response.responseText);
                if (jobID < 0) {
                    msg("Submit Monte Carlo Request", "Could not submit Monte Carlo Analysis Request");
                } else {
                    msg("Submit Monte Carlo Request", "Monte Carlo Analysis Submitted for Processing (ID: " + jobID + ")<br/><br/>Use the 'Reports' tab to review results");
                }
                QRM.app.getExplorerController().monteWindow.close();
            },
            failure: function () {
                msg("Submit Monte Carlo Request", "Could not submit Monte Carlo Analysis Request");
            }
        });
    },
    runMonte: function () {

        if (!checkExplorerSelection()) {
            msg("Monte Carlo Analysis", "Please select the risk you wish to include in the analysis");
            return;
        }
        if (this.monteWindow == null) {
            this.monteWindow = Ext.create('QRM.view.explorer.MonteWindow');
        }
        this.monteWindow.show();
        $$('qrmID-monteConfigForm').getForm().reset();
        $$('qrmID-monteRiskTable').store.loadData(getExplorerRisks());


    },
    deleteRisk: function () {

        var me = this;

        Ext.Msg.show({
            title: 'Delete Risks',
            msg: '<center>Are you sure you wish to delete the selected risks?</center>',
            width: 300,
            buttons: Ext.Msg.YESNO,
            fn: function (btn) {

                if (btn != 'yes') {
                    return;
                }


                var riskIDs = new Array();
                Ext.Array.each($$('qrmID-RiskTable').getSelectionModel().getSelection(), function (item) {
                    riskIDs.push(item.data.riskID);
                });

                Ext.Ajax.request({
                    url: "./deleteRisks",
                    params: {
                        "DATA": JSON.stringify(riskIDs),
                            "PROJECTID": QRM.global.projectID
                    },
                    success: function (response) {
                        if (Ext.decode(response.responseText)) {
                            msg("Delete Risks", "Security Restriction: You were not authorised to delete one or more of the selected risks");
                        }
                        me.populateGrid(QRM.global.projectID, $$('cbDescendants').value);
                    }
                });
            },
            icon: Ext.Msg.QUESTION
        });

    },

    openRisk: function (me, record, item) {

        if (riskEditor == null) {
            riskEditor = Ext.create('QRM.view.editor.RiskEditor', {
                title: 'Risk Editor'
            });
        }
        riskEditor.show();

        // Prepare the drop downs
        $$('qrmID-RiskEditorRiskOwner').bindStore();
        $$('qrmID-RiskEditorRiskManager').bindStore();
        $$('qrmID-RiskEditorPrimCat').bindStore();

        $$('qrmID-RiskEditorRiskOwner').bindStore(projectOwnersStore);
        $$('qrmID-RiskEditorRiskManager').bindStore(projectManagersStore);
        $$('qrmID-RiskEditorPrimCat').bindStore(projectCategoryStore);

        Ext.Ajax.request({
            url: "./getRisk",
            params: {
                "PROJECTID": QRM.global.projectID,
                    "RISKID": record.data.riskID
            },
            success: function (response) {
                QRM.app.getRiskEditorController().setRisk(Ext.JSON.decode(response.responseText));
            }

        });

    },
    filterPanelChanged: function () {
        if (this.suspendFilterPanelListener) {
            return;
        }
        $$('txtRiskCode').setValue("");
        this.populateGrid(QRM.global.projectID, $$('cbDescendants').value);
    },

    okToSwitchProject: function () {
        return true;
    },
    okToSwitchTab: function () {
        return true;
    },
    resizePanel: function () {
        this.switchProject(QRM.global.project, $$('cbDescendants').value);
    },
    switchTab: function () {
        this.switchProject(QRM.global.project, $$('cbDescendants').value);
    },

    switchProject: function (project, desc) {

       if (this.projectSwitch){
        this.resetFilterPanel();
        $$('txtRiskCode').setValue("");

        try {
            $$('comboRiskOwner').bindStore();
            $$('comboRiskManager').bindStore();
            $$('comboCategory').bindStore();

            projectOwnersStore.loadData(project.owners);
            $$('comboRiskOwner').bindStore(projectOwnersStore);

            projectManagersStore.loadData(project.managers);
            $$('comboRiskManager').bindStore(projectManagersStore);

            projectCategoryStore.loadData(project.riskCategorys);
            $$('comboCategory').bindStore(projectCategoryStore);

        } catch (e) {
            alert("Filter Population: " + e.message);
        }

        this.resetMatrix();
        this.populateGrid(project.projectID, desc);
       }
    },
    resetMatrix: function () {
        var valt = QRM.global.project.extraStuff.split(";")[0].split(":");
        var valu = QRM.global.project.extraStuff.split(";")[1].split(":");
        var tolString = QRM.global.project.matrix.tolString;
        var maxImpact = QRM.global.project.matrix.maxImpact;
        var maxProb = QRM.global.project.matrix.maxProb;
        //Create the SVG to illustrate the matrix
        setMatrix(tolString, maxImpact, maxProb, valu, '#untreatedMat',false);
        setMatrix(tolString, maxImpact, maxProb, valt, '#treatedMat', true);
        
    },
    matrixFilter: function (paramsMap) {
       if (QRM.global.viewState =='Rolled'){
          paramsMap.ROLLED = true;
       }
        this.resetFilterPanel();
        Ext.data.StoreManager.get('Explorer').load({
            params: paramsMap
        });
    },
    resetFilterBtnHandler: function () {
       if (QRM.global.viewState =='Rolled'){
          this.resetFilterPanel();
          $$('txtRiskCode').setValue("");
          this.gridDetailView();
          $$('qrmID-explorerGridDetailViewBtn').setChecked(true);
       } else {
          this.resetFilterPanel();
          $$('txtRiskCode').setValue("");
          this.populateGrid(QRM.global.projectID, $$('cbDescendants').value);
       }
    },

    handleRiskCodeKeyPress: function (field, e) {
        if (e.getKey() == Ext.EventObject.RETURN) {
            this.handleRiskCodeSearch();
        }
    },
    handleRiskCodeSearch: function () {

        if (qoQRM.selectedCellID != null && qoQRM.selectedCellClassName != null) {
            document.getElementById(qoQRM.selectedCellID).className = qoQRM.selectedCellClassName;
        }

        this.resetFilterPanel();


        Ext.Ajax.request({
            url: "./findRisk",
            params: {
                "RISKID": $$('txtRiskCode').value
            },
            success: function (response) {
                try {
                    var foundRisk = Ext.JSON.decode(response.responseText);
                    if (!foundRisk.projectID) {
                        alert("Risk could not be found");
                    } else {
                        QRM.global.projectID = foundRisk.projectID;
                        Ext.Ajax.request({
                            url: "./getRiskProject",
                            params: {
                                "PROJECTID": QRM.global.projectID,
                                    "DESCENDANTS": $$('cbDescendants').value,
                                    "ROLLED": false
                            },
                            success: function (response2) {
                                try {
                                    var store = $$("qrmNavigatorID").getStore();
                                    var record = store.findRecordByProjectID(QRM.global.projectID);
                                    $$("qrmNavigatorID").getSelectionModel().select(record);


                                    QRM.global.project = Ext.JSON.decode(response2.responseText);
                                    QRM.app.getExplorerController().getFoundRisk(foundRisk.riskID);
                                    QRM.app.getExplorerController().resetMatrix();
                                    QRM.app.getExplorerController().resetFilterPanel();
                                } catch (e) {
                                    alert(e.message);
                                }
                            }

                        });
                    }
                } catch (e) {
                    alert(e.message);
                }
            }

        });
    },
    handleResetFilterPanel: function () {
        this.resetFilterPanel();
    },
    resetFilterPanel: function () {

       resetSelectedCell();

        this.suspendFilterPanelListener = true;

        $$('comboRiskOwner').clearValue();
        $$('comboRiskManager').clearValue();
        $$('comboCategory').clearValue();

        $$('cbActive').setValue(true);
        $$('cbPending').setValue(true);
        $$('cbInactive').setValue(true);
        $$('cbTreated').setValue(true);
        $$('cbUntreated').setValue(true);
        $$('cbExtreme').setValue(true);
        $$('cbHigh').setValue(true);
        $$('cbSignificant').setValue(true);
        $$('cbModerate').setValue(true);
        $$('cbLow').setValue(true);

        this.suspendFilterPanelListener = false;

    },
    populateGrid: function (projectID, desc) {

       var  p = {
             "DESCENDANTS": desc,
                 "PROJECTID": projectID,
                 "PROCESSFILTER": true,
                 "TOLEX": $$('cbExtreme').value,
                 "TOLHIGH": $$('cbHigh').value,
                 "TOLSIG": $$('cbSignificant').value,
                 "TOLMOD": $$('cbModerate').value,
                 "TOLLOW": $$('cbLow').value,
                 "STATACTIVE": $$('cbActive').value,
                 "STATPENDING": $$('cbPending').value,
                 "STATINACTIVE": $$('cbInactive').value,
                 "STATTREATED": $$('cbTreated').value,
                 "STATUNTREATED": $$('cbUntreated').value,
                 "CATID": $$('comboCategory').getValue(),
                 "OWNERID": $$('comboRiskOwner').getValue(),
                 "MANAGERID": $$('comboRiskManager').getValue()
         };
       if (QRM.global.viewState=="Rolled") {
          p.ROLLED = true;
       }
        Ext.data.StoreManager.get('Explorer').load({
            params: p
        });
    },

    getFoundRisk: function (riskID) {
        Ext.data.StoreManager.get('Explorer').load({
            params: {
                "DESCENDANTS": $$('cbDescendants').value,
                    "PROJECTID": QRM.global.projectID,
                    "PROCESSFILTER": true,
                    "RISKID": riskID,
                    "TOLEX": true,
                    "TOLHIGH": true,
                    "TOLSIG": true,
                    "TOLMOD": true,
                    "TOLLOW": true,
                    "STATACTIVE": true,
                    "STATPENDING": true,
                    "STATINACTIVE": true,
                    "STATTREATED": true,
                    "STATUNTREATED": true,
                    "CATID": -1,
                    "OWNERID": -1,
                    "MANAGERID": -1
            }
        });
    },
    chooseImportRisks:function(config){
       if (config.type == 'XML'){
          this.chooseImportRisksXML(config);
       } else {
          this.chooseImportRisksCSV(config);
       }
    },
    chooseImportRisksXML:function(config){
       if (this.selectXMLRisksWindow == null) {
          this.selectXMLRisksWindow = Ext.create('QRM.view.explorer.SelectXMLRisksWindow');
      }
       this.selectXMLRisksWindow.key = config.key;
       this.selectXMLRisksWindow.show();
       
       $$('qrmID-SelectXMLRiskImportGrid').store.loadData(config.myArr);
    },
    importSelectedXMLRisks:function(){
        
       var choices = new Array();
       choices.push($$("qrmID-SelectXMLRisksWindow").key);
       Ext.Array.each($$('qrmID-SelectXMLRiskImportGrid').getSelectionModel().getSelection(), function(item){
          choices.push(item.raw.riskID);
       });
    
       Ext.Ajax.request({
          scope:this,
          url: "./importRisks",
          params: {
             "DATA": JSON.stringify(choices),
             "PROJECTID": QRM.global.projectID
          },
          success: function (response) {
             msg("Import Risks",response.responseText);
              QRM.app.getMainTabsController().switchProject(QRM.global.projectID, $$('cbDescendants').value);
             this.selectXMLRisksWindow.close();
          }
       });
    }
    
});