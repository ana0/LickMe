import smartpy as sp

@sp.module
def main():

    # Map type: artwork_id -> (timestamp -> tez amount)
    artwork_map_type: type = sp.map[sp.string, sp.map[sp.timestamp, sp.mutez]]

    class LickAuction(sp.Contract):
        def __init__(self, admin):
            # Basic storage, including admin address and artworks
            self.data.admin = admin
            # Map: artwork_id (string) -> map(timestamp -> tez amount)
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
            For each artwork we create an empty map: timestamp -> tez amount.
            """
            assert sp.sender == self.data.admin
            # Register artwork with an empty timestamp->int map
            self.data.artworks[artwork_id] = {}

        @sp.entrypoint
        def pay_for_artwork(self, artwork_id: sp.string):
            """
            Payable: send tez for a given artwork.
            If there's already an amount stored at the current timestamp, add to it;
            otherwise, create a new entry for this timestamp.
            """
            assert sp.amount > sp.mutez(0)
            assert self.data.artworks.contains(artwork_id)

            ts = sp.now  # current timestamp

            if self.data.artworks[artwork_id].contains(ts):
                self.data.artworks[artwork_id][ts] += sp.amount
            else:
                self.data.artworks[artwork_id][ts] = sp.amount


@sp.add_test()
def test():
    scenario = sp.test_scenario("LickAuction")
    scenario.h1("Lick Auction")

    # Admin account (represents the contract creator / admin)
    admin = scenario.test_account("Admin")
    buyer = scenario.test_account("Buyer")

    # Initialize contract with admin address
    c1 = main.LickAuction(admin=admin.address)
    scenario += c1

    # Initial admin should be the creator
    scenario.h2("Initial admin")
    scenario.verify(c1.data.admin == admin.address)

    # Admin can add an artwork
    scenario.h2("Add artwork (admin)")
    c1.add_artwork("artwork-1", _sender=admin)

    # Buyer can pay for the artwork
    scenario.h2("Pay for artwork")
    c1.pay_for_artwork("artwork-1", _sender=buyer, _amount=sp.tez(1))


