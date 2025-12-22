# Tezos Smart Contract

This directory contains a simple Tezos smart contract written in SmartPy.

## Setup

1. Install SmartPy:
```bash
pip install -r requirements.txt
```

2. Compile the contract and run any tests:
```bash
python contract.py
```

Note: According to the [SmartPy documentation](https://smartpy.tezos.com/manual/compilation/compiling.html), you compile contracts by running the Python file directly. SmartPy automatically runs the tests and generates output files when you compile.

## Contract

The `SimpleContract` provides:
- `set_value(value)`: Sets a stored value
- `increment()`: Increments the stored value by 1

