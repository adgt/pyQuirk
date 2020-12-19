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
		width : 1000,
		height : 450,
	})
});

var QuirkView = widgets.DOMWidgetView.extend({

	render: function() {

		model = this.model;
		
		this.frame = document.createElement('iframe');
		this.frame.id = "iframe";
		this.frame.width = model.get('width');
		this.frame.height = model.get('height');
		this.frame.src = quirkUrl.default;//#circuit={"cols":[["Z"],[1,"H","Y"]]}';
		// this.frame.srcdoc = quirkHtml; // use html-loader instead of file-loader for this
		// this.el.innerHTML = quirkHtml;
		
		this.frame.onload = function() {
			console.log("IFRAME loaded: " + this.src);
			this.contentWindow.addEventListener('hashchange', function() {
				console.log("HASHCHANGE");
			});
			this.contentWindow.onhashchange = function() {
				console.log("hashchange");
			};
					
			this.contentWindow.onclick = function() {
				console.log("ONCLICK");
				qasm = this.document.getElementById('export-qasm-pre').innerText;
				model.set('circuit_qasm', qasm);
				model.save_changes();
			};	
		};

		this.el.appendChild(this.frame);

		this.model.on('change:value', this.circuit_updated, this);
		this.model.on('change:width', this.update_width, this);
		this.model.on('change:height', this.update_height, this);
	},

	update_width: function(change) {
		this.frame.width = change.new
	},

	update_height: function(change) {
		this.frame.height = change.height
	},

	circuit_updated: function() {

		this.frame.src = quirkUrl.default + `#circuit={"cols":${this.model.get("value").replaceAll("'", "\"")}}`; // #circuit={"cols":[["Z"],[1,"H","Y"]]}';
	}
});


module.exports = {
	QuirkModel,
	QuirkView
};
