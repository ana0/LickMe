import smartpy as sp

@sp.module
def main():

    artwork_map_type: type = sp.map[sp.string, sp.map[sp.int, sp.int]]

    class LickAuction(sp.Contract):
        def __init__(self, admin):
            # Basic storage, including admin address and artworks
            self.data.admin = admin
            # Map: artwork_id (string) -> map(timestamp (int) -> int)
            self.data.artworks = {}
            sp.cast(self.data.artworks, artwork_map_type)

        @sp.entrypoint
        def update_admin(self, new_admin):
            """Admin-gated: update the admin address."""
            assert sp.sender == self.data.admin
            self.data.admin = new_admin

        @sp.entrypoint
        def add_artwork(self, artwork_id: sp.string):
            """
            Admin-gated: add a new artwork.
            For each artwork we create an empty map: timestamp (int) -> int.
            """
            assert sp.sender == self.data.admin
            # Register artwork with an empty timestamp->int map
            self.data.artworks[artwork_id] = {}


@sp.add_test()
def test():
    scenario = sp.test_scenario("LickAuction")
    scenario.h1("Lick Auction")

    # Admin account (represents the contract creator / admin)
    admin = scenario.test_account("Admin")

    # Initialize contract with admin address
    c1 = main.LickAuction(admin=admin.address)
    scenario += c1

    # Initial admin should be the creator
    scenario.h2("Initial admin")
    scenario.verify(c1.data.admin == admin.address)

    # Admin can add an artwork
    scenario.h2("Add artwork (admin)")
    c1.add_artwork("artwork-1", _sender=admin)


