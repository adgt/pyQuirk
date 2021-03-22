var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');

var quirkUrl = require('./quirk.html');
// See quirk.py for the kernel counterpart to this file.

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
		_model_module : 'pyquirk',
		_view_module : 'pyquirk',
		_model_module_version : '0.1.6',
		_view_module_version : '0.1.6',
		width : 1000,
		height : 450,
		scale : 0.5,
	})
});

var QuirkView = widgets.DOMWidgetView.extend({

	render: function() {

		model = this.model;
		width = model.get('width');
		height = model.get('height');
		scale = model.get('scale');
		
		this.container = document.createElement('div')
		this.container.id = "pyquirk"
		this.container.style.width = `${width}px`;
		this.container.style.height = `${height}px`;
		
		this.frame = document.createElement('iframe');
		this.frame.id = "iframe";
		this.frame.style.transformOrigin = "0 0";
		this.frame.style.transform = `scale(${scale})`;
		this.frame.style.width = `${1/scale * 100}%`;
		this.frame.style.height = `${1/scale * 100}%`;
		this.frame.src = quirkUrl.default;
		this.container.appendChild(this.frame);
		
		this.frame.onload = function() {
			console.log("IFRAME loaded: " + this.src);
			this.contentWindow.onclick = function() {
				qasm = this.document.getElementById('export-qasm-pre').innerText;
				model.set('circuit_qasm', qasm);
				model.save_changes();
			};	
		};

		this.el.appendChild(this.container);

		this.model.on('change:value', this.circuit_updated, this);
		this.model.on('change:width', this.update_width, this);
		this.model.on('change:height', this.update_height, this);
		this.model.on('change:scale', this.update_scale, this);
	},

	update_width: function(property) {
		this.container.style.width = `${this.model.get('width')}px`;
	},

	update_height: function(property) {
		this.container.style.height = `${this.model.get('height')}px`;
	},

	update_scale: function(property) {
		scale = this.model.get('scale');
		this.frame.style.transform = `scale(${scale})`;
		this.frame.style.width = `${1/scale * 100}%`;
		this.frame.style.height = `${1/scale * 100}%`;
	},
 
	circuit_updated: function() {
		this.frame.src = quirkUrl.default + `#circuit={"cols":${this.model.get("value").replaceAll("'", "\"")}}`;
	}
});


module.exports = {
	QuirkModel,
	QuirkView
};
