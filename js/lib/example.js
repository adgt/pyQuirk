var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');

// var quirkHtml = require('html-loader!./quirk.html');
var quirkUrl = require('file-loader!./quirk.html');

// See example.py for the kernel counterpart to this file.


// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
var QuirkModel = widgets.DOMWidgetModel.extend({
	defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
		_model_name : 'QuirkModel',
		_view_name : 'QuirkView',
		_model_module : 'pyQuirk',
		_view_module : 'pyQuirk',
		_model_module_version : '0.1.0',
		_view_module_version : '0.1.0',
		value : 'Hello World!'
	})
});

var QuirkView = widgets.DOMWidgetView.extend({

	render: function() {

		this.frame = document.createElement('iframe');
		this.frame.id = "iframe";
		this.frame.height = 450;
		this.frame.width = 1000;
		this.frame.src = quirkUrl.default;//#circuit={"cols":[["Z"],[1,"H","Y"]]}';
		
		this.el.appendChild(this.frame);

		this.model.on('change:circuit_qasm', this.circuit_updated, this);
	},

	circuit_updated: function() {

		this.frame.src = quirkUrl.default + `#circuit={"cols":${this.model.get("circuit_qasm").replaceAll("'", "\"")}}`; // #circuit={"cols":[["Z"],[1,"H","Y"]]}';
	}
});


module.exports = {
	QuirkModel,
	QuirkView
};
