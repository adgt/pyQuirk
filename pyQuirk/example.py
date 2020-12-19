import ipywidgets as widgets
from traitlets import Unicode, Integer
from .quirk import qasm_to_quirk
# See js/lib/example.js for the frontend counterpart to this file.

@widgets.register
class Quirk(widgets.DOMWidget):
	"""An example widget."""

	# Name of the widget view class in front-end
	_view_name = Unicode('QuirkView').tag(sync=True)

	# Name of the widget model class in front-end
	_model_name = Unicode('QuirkModel').tag(sync=True)

	# Name of the front-end module containing widget view
	_view_module = Unicode('pyQuirk').tag(sync=True)

	# Name of the front-end module containing widget model
	_model_module = Unicode('pyQuirk').tag(sync=True)

	# Version of the front-end module containing widget view
	_view_module_version = Unicode('^0.1.0').tag(sync=True)
	# Version of the front-end module containing widget model
	_model_module_version = Unicode('^0.1.0').tag(sync=True)

	# Widget specific property.
	# Widget properties are defined as traitlets. Any property tagged with `sync=True`
	# is automatically synced to the frontend *any* time it changes in Python.
	# It is synced back to Python from the frontend *any* time the model is touched.
	width = Integer(1000).tag(sync=True)
	height = Integer(450).tag(sync=True)
	value = Unicode("").tag(sync=True)
	circuit_qasm = Unicode("").tag(sync=True)

	def update_circuit(self, circuit):
		self.circuit_qasm = circuit.qasm()
		self.value = qasm_to_quirk(circuit)