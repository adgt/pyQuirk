pyQuirk
===============================

Widget for Quirk

Installation
------------

To install use pip:

    $ pip install pyQuirk
    $ jupyter nbextension enable --py --sys-prefix pyQuirk

To install for jupyterlab

    $ jupyter labextension install pyQuirk

For a development installation (requires npm),

    $ git clone https://github.com//pyQuirk.git
    $ cd pyQuirk
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix pyQuirk
    $ jupyter nbextension enable --py --sys-prefix pyQuirk
    $ jupyter labextension install js

When actively developing your extension, build Jupyter Lab with the command:

    $ jupyter lab --watch

This takes a minute or so to get started, but then automatically rebuilds JupyterLab when your javascript changes.

Note on first `jupyter lab --watch`, you may need to touch a file to get Jupyter Lab to open.

