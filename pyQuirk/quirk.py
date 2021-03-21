import ipywidgets as widgets
import re
from traitlets import Unicode, Integer, Float
# See js/lib/quirk.js for the frontend counterpart to this file.

@widgets.register
class Quirk(widgets.DOMWidget):
    """A Python widget for Quirk."""

    # Name of the widget view class in front-end
    _view_name = Unicode('QuirkView').tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode('QuirkModel').tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode('pyquirk').tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode('pyquirk').tag(sync=True)

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
    scale = Float(0.5).tag(sync=True)
    value = Unicode("").tag(sync=True)
    circuit_qasm = Unicode("").tag(sync=True)

    def update_circuit(self, circuit):
        qasm = circuit.qasm()
        self.circuit_qasm = qasm
        self.update_from_qasm(qasm)
        
    def update_from_qasm(self, qasm):
        self.value = qasm_to_quirk(qasm)

gates = {
    "h": "H",
    "x": "X",
    "y": "Y",
    "z": "Z",
    "measure": "Measure",
    "s": "Z^½",
    "sdg": "Z^-½",
    "t": "Z^¼",
    "tdg": "Z^-¼",
    "swap": "Swap",
    "sx": "X^½",
    "sxdg": "X^-½",
    "rx": "Rxft",
    "ry": "Ryft",
    "rz": "Rzft",
}

def get_qubit_number(str):
    return int(str[str.find("[")+1 : str.find("]")])

def qasm_to_quirk(qasm):
    '''
    Sample QASM String -

    OPENQASM 2.0;
    include "qelib1.inc";
    qreg q[3];
    h q[0];
    cx q[0],q[1];
    y q[2];

    '''
    qubit_search = re.compile(r"qreg.*q\[(\d*)\]", re.IGNORECASE)
    clbit_search = re.compile(r"creg.*q\[(\d*)\]", re.IGNORECASE)

    num_qubits = 0
    num_clbits = 0
    
    qubit_match = qubit_search.findall(qasm)
    clbit_match = clbit_search.findall(qasm)
    if qubit_match:
        num_qubits = int(qubit_match[0])
    if clbit_match:
        num_clbits = int(clbit_match[0])
        
    qreg = ""
    creg = ""

    qasm_arr = qasm.split("\n")[2:-1];

    #while len(qasm_arr) > 0:
        # each pass defines one quirk column
    cols = [[]]
    control_cols = []
    colnum = 0
    qubits_used = {}
    qubit_to_column = {qb: 0 for qb in range(num_qubits)}

    for instr in qasm_arr:
        if 'openqasm' in instr.lower():
            continue
        if 'include' in instr:
            continue
        
        if 'qreg' in instr:
            qreg = instr.replace('qreg ', '').split('[')[0]
            continue
        if 'creg' in instr:
            creg = instr.replace('creg ', '').split('[')[0]
        # we know it is an instruction
        instr_arr = instr.split(' ')
        gate = instr_arr[0]
        args = instr_arr[1]

        #print(gate, args)

        if gate.startswith('c'):
            # controlled operation - so it needs a column of its own
            col = []
            colnum = max(qubit_to_column.values())
            args = args.split(',')
            control_cols.append(colnum)
            control_qubits = [get_qubit_number(args[0])]
            if gate.startswith('cc'):
                c2 = args[1]
                control_qubits.append(get_qubit_number(args[1]))
            target = get_qubit_number(args[-1])
            cols[colnum] = []
            #print(control_qubits, target)
            for qb in range(1 + max([target]+control_qubits)):
                if qb in control_qubits:
                    col.append("•")
                    qubit_to_column[qb] = colnum + 1
                elif qb == target:
                    col.append(gates[gate.replace("c", "").replace("c", "")])
                    qubit_to_column[qb] = colnum + 1
                else:
                    col.append(1)
            cols[colnum] = col
            for qubit in qubit_to_column:
                while qubit_to_column[qubit] in control_cols:
                    qubit_to_column[qubit] += 1


        else:
            # args = args.split(',') - not required, must be a single qubit gate
            #print("Not a control", gate, args)
            if gate == "measure":
                args = args.split("->")
                target = get_qubit_number(args[0])

            else:
                target = get_qubit_number(args)

            #print("target=", target)
            #print(qubit_to_column)
            if len(cols[qubit_to_column[target]]) <= target:
                cols[qubit_to_column[target]] += [1 for _ in range(target - len(cols[qubit_to_column[target]]) + 1)]
            cols[qubit_to_column[target]][target] = gates[gate]

            qubit_to_column[target] += 1
            while qubit_to_column[target] in control_cols:
                qubit_to_column[target] += 1

        cols.append([])
    return str(cols)