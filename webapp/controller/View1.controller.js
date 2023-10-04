sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/BindingMode',
    'sap/ui/model/json/JSONModel',
    'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/base/util/UriParameters',
    'sap/m/BusyDialog',
    'sap/m/MessageToast',
    './InitPage'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, BindingMode, JSONModel, ChartFormatter, Format, Filter, FilterOperator, UriParameters, BusyDialog, MessageToast, InitPageUtil) {
        "use strict";

        oVizFrame: null;
        vServiceUrl: null;
        oModel: null;


        return Controller.extend("pie.chart.v2.pie.chart.controller.View1", {



            onInit: function () {
                var BusyDialog1 = new BusyDialog();
                this.vServiceUrl = "/sap/opu/odata/sap/Z_B_DBFAM_VAR_COMPO/";
                this.oModel = new sap.ui.model.odata.v2.ODataModel(this.vServiceUrl, true);
                BusyDialog1.open();
                var Label1 = this.getView().byId("label1");

                var pieChartModel = new sap.ui.model.json.JSONModel([]);
                this.getView().setModel(pieChartModel, "PieData")


                //Gestione del recupero dei Parametri nell'Url tramite oggetto Semantico
                if (this.getOwnerComponent().getComponentData()) {
                    var startupParams = this.getOwnerComponent().getComponentData().startupParameters; // get Startup params from Owner Component
                    if (startupParams.filename) {
                        var nomeFile = startupParams.filename[0];
                    };
                    if (startupParams.mode) {
                        var mode = startupParams.mode[0];
                    };
                }

                var filters = new Array();
                if (nomeFile) {
                    // var filterByName = new sap.ui.model.Filter("filename", sap.ui.model.FilterOperator.EQ, "ALIA_EMPOLI_2021-01-01_2021-12-31.TXT");  
                    var filterByName = new sap.ui.model.Filter("filename", sap.ui.model.FilterOperator.EQ, nomeFile);
                    filters.push(filterByName);
                    Label1.setText("Statistiche" + nomeFile);
                    //var filters = new Filter("filename", sap.ui.model.FilterOperator.EQ, nomeFile);

                } else {
                    BusyDialog1.close();
                    var msg = 'Nessun FileName specificato';
                    MessageToast.show(msg);
                    //Label1.setText("Nessun Dato");
                    return '';
                }
                if (!mode) {
                    BusyDialog1.close();
                    var msg = 'Nessun mode specificato';
                    MessageToast.show(msg);
                    return;
                } else {
                    var entity;
                    if (mode === '2') {
                        entity = '/ZC_PIE_CHART';
                    } else if (mode === '3') {
                        entity = '/ZC_COUNT_ESITI_VAR_COMP_UI';
                    }
                }

                var that = this;
                this.oModel.read(entity, {
                    async: false,
                    filters: [filters],
                    success: function (oData, response) {
                        //that.getView().setModel(that.oModel, "PieChart");
                        that.getView().getModel("PieData").setData(oData);
                        BusyDialog1.close();
                    },
                    error: function ( oData, response ) {
                        BusyDialog1.close();
                        var msg = 'Errore Lettura Entity' + entity;
                        MessageToast.show(msg);
                    }
                });

                var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
                oVizFrame.setVizProperties({
                    legend: {
                        title: {
                            visible: false
                        }
                    },
                    title: {
                        visible: false
                    }
                });

                Format.numericFormatter(ChartFormatter.getInstance());
                var oPopOver = this.getView().byId("idPopOver");
                oPopOver.connect(oVizFrame.getVizUid());
                oPopOver.setFormatString(ChartFormatter.DefaultPattern.STANDARDFLOAT);
                InitPageUtil.initPageSettings(this.getView());
            },
            myOnClickHandler: function (oEvent) {

            }
        });
    });
