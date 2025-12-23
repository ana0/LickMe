import smartpy as sp

tstorage = sp.record(admin = sp.address, artworks = sp.map(sp.string, sp.map(sp.int, sp.int))).layout(("admin", "artworks"))
tparameter = sp.variant(add_artwork = sp.string, update_admin = sp.address).layout(("add_artwork", "update_admin"))
tprivates = { }
tviews = { }
