/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"piechartv2/pie.chart/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
