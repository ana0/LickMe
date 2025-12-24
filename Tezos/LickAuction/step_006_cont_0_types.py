import smartpy as sp

tstorage = sp.record(admin = sp.address, artworks = sp.map(sp.string, sp.list(sp.record(amount = sp.mutez, timestamp = sp.timestamp).layout(("amount", "timestamp")))), pending = sp.map(sp.string, sp.record(amount = sp.mutez, timestamp = sp.timestamp).layout(("amount", "timestamp")))).layout(("admin", ("artworks", "pending")))
tparameter = sp.variant(add_artwork = sp.string, pay_for_artwork = sp.string, update_admin = sp.address, withdraw = sp.unit).layout((("add_artwork", "pay_for_artwork"), ("update_admin", "withdraw")))
tprivates = { }
tviews = { "get_artwork_payments": (sp.string, sp.list(sp.record(amount = sp.mutez, timestamp = sp.timestamp).layout(("amount", "timestamp")))) }
