import smartpy as sp

tstorage = sp.record(stored_value = sp.int).layout("stored_value")
tparameter = sp.variant(increment = sp.unit, set_value = sp.int).layout(("increment", "set_value"))
tprivates = { }
tviews = { }
