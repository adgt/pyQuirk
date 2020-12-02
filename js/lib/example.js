var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');

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


// Custom View. Renders the widget model.
var QuirkView = widgets.DOMWidgetView.extend({
    // Defines how the widget gets rendered into the DOM
    render: function() {

        // this.email_input = document.createElement('input');
        // this.email_input.type = 'email';
        // this.email_input.value = this.model.get('value2');
        // this.email_input.disabled = false;
               
        // this.el.appendChild(this.email_input);
        //this.h1 = document.createElement('h1')
        //this.h1.innerHTML = this.model.get('value2');
        //this.el.appendChild(this.h1);
        //console.log(this.model.get('value'))
        this.frame = document.createElement('iframe');
        this.frame.height = 500
        this.frame.width = 1000
        this.frame.src = 'pyQuirk/quirk.html#circuit={"cols":[["Z"],[1,"H","Y"]]}'
        //frame.style.display = 'none';
        //document.body.appendChild(frame);             
        //frame.contentDocument.open();
        //frame.srcdoc = this.model.get('value');
        //frame.contentDocument.close();
        //console.log(frame)
        //var quirk = frame.contentDocument.body.firstChild;
        //document.body.removeChild(frame);
        console.log(this.frame)
        this.el.appendChild(this.frame)
        //this.el.innerHTML = document.createElement('<div><a href="#>text</a></div>'))
        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        this.model.on('change:input_str', this.value_changed, this);
    },

    value_changed: function() {
        console.log(this.model.get('input_str'))
        this.el.removeChild(this.frame)
        this.frame.src = 'pyQuirk/quirk.html'+this.model.get('input_str');
        this.el.appendChild(this.frame)
    }
});


module.exports = {
    QuirkModel,
    QuirkView
};
