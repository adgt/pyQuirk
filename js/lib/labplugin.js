var plugin = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'pyquirk:plugin',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'pyquirk',
          version: plugin.version,
          exports: plugin
      });
  },
  autoStart: true
};

