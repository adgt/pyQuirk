
# pyQuirk
A Python [widget](https://github.com/jupyter-widgets/ipywidgets) for [Quirk](https://github.com/Strilanc/Quirk) to be used in Jupyter notebooks, JupyterLab, and the IPython kernel.

![Example](example.gif)

## Getting Started
### Installation

Tested with JupyterLab 2, so may not work in JupyterLab 3 just yet. If you are wanting to use this with Jupyter notebook, then follow the [development install instructions](#development) below.

To install use pip (only works for JupyterLab currently):

    $ pip install pyquirk

If you are using JupyterLab <= 2 (note the lowercase 'pyquirk'):

    $ jupyter labextension install @jupyter-widgets/jupyterlab-manager pyquirk

### Example

Take a look at [example.ipynb](example.ipynb) for a simple example.

Otherwise, you can simply run:
```python
from pyQuirk import Quirk
quirk = Quirk()
quirk
```

### API

Quirk()
- `width`: display width of the widget
- `height`: display height of the widget
- `scale`: scale of the inner Quirk display (default 0.5)
- `value`: circuit in Quirk format
- `circuit_qasm`: read-only property to get the qasm of the current circuit
- `update_circuit(circuit)`: convenience function for passing a Qiskit circuit
- `update_from_qasm(qasm)`: replace the current circuit with qasm (not all gates supported, currently)

## Development

For a development installation (requires [Node.js](https://nodejs.org)),

    $ git clone https://github.com/adgt/pyquirk.git
    $ cd pyquirk
    $ pip install -e .

If you are working in Jupyter notebooks, then run the following commands:

    $ jupyter nbextension install --py --symlink --sys-prefix pyQuirk
    $ jupyter nbextension enable --py --sys-prefix pyQuirk

If you are working in JupyterLab, then run the following command:    

    $ jupyter labextension install js

Follow the instructions above for a development installation. Then, to actively develop on your machine, run Jupyter Lab with the command:

    $ jupyter lab --watch

This takes a minute or so to get started, but then automatically rebuilds JupyterLab when your javascript changes.

Note on first `jupyter lab --watch`, you may need to touch a file to get Jupyter Lab to open.

#### Project repository created with the [widget-cookiecutter](https://github.com/jupyter-widgets/widget-cookiecutter) template