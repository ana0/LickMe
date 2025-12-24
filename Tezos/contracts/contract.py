import smartpy as sp

@sp.module
def main():

    # Record type for a single payment
    payment_record: type = sp.record(timestamp=sp.timestamp, amount=sp.mutez)

    # Map type: artwork_id -> list of payment records
    artwork_map_type: type = sp.map[sp.string, sp.list[payment_record]]

    # Map type: artwork_id -> current pending payment (not yet finalized to list)
    pending_payment_type: type = sp.map[sp.string, payment_record]

    class LickAuction(sp.Contract):
        def __init__(self, admin):
            # Basic storage, including admin address and artworks
            self.data.admin = admin
            # Map: artwork_id (string) -> list of finalized payment records
            self.data.artworks = {}
            sp.cast(self.data.artworks, artwork_map_type)
            # Map: artwork_id -> current pending payment at latest timestamp
            self.data.pending = {}
            sp.cast(self.data.pending, pending_payment_type)

        @sp.entrypoint
        def update_admin(self, new_admin):
            """Admin-gated: update the admin address."""
            assert sp.sender == self.data.admin
            self.data.admin = new_admin

        @sp.entrypoint
        def add_artwork(self, artwork_id: sp.string):
            """
            Admin-gated: add a new artwork.
            For each artwork we create an empty list of payment records.
            """
            assert sp.sender == self.data.admin
            # Register artwork with an empty list of payments
            self.data.artworks[artwork_id] = []

        @sp.entrypoint
        def pay_for_artwork(self, artwork_id: sp.string):
            """
            Payable: send tez for a given artwork.
            If there's already a payment at the current timestamp, add to it;
            otherwise, append a new payment record.
            """
            assert sp.amount > sp.mutez(0)
            assert self.data.artworks.contains(artwork_id)

            ts = sp.now

            if self.data.pending.contains(artwork_id):
                pending = self.data.pending[artwork_id]
                if pending.timestamp == ts:
                    # Same timestamp: accumulate amount
                    self.data.pending[artwork_id] = sp.record(timestamp=ts, amount=pending.amount + sp.amount)
                else:
                    # Different timestamp: finalize old pending to list, create new pending
                    self.data.artworks[artwork_id] = sp.cons(pending, self.data.artworks[artwork_id])
                    self.data.pending[artwork_id] = sp.record(timestamp=ts, amount=sp.amount)
            else:
                # No pending payment: create new one
                self.data.pending[artwork_id] = sp.record(timestamp=ts, amount=sp.amount)

        @sp.onchain_view
        def get_artwork_payments(self, artwork_id: sp.string):
            """
            Returns the list of all payment records (timestamp, amount) for a given artwork.
            Includes both finalized payments and any pending payment at current timestamp.
            """
            assert self.data.artworks.contains(artwork_id)
            payments = self.data.artworks[artwork_id]
            if self.data.pending.contains(artwork_id):
                return sp.cons(self.data.pending[artwork_id], payments)
            else:
                return payments

        @sp.entrypoint
        def withdraw(self):
            """
            Admin-gated: withdraw all funds from the contract to the admin address.
            """
            assert sp.sender == self.data.admin
            sp.send(self.data.admin, sp.balance)


@sp.add_test()
def test():
    scenario = sp.test_scenario("LickAuction")
    scenario.h1("Lick Auction")

    # Admin account (represents the contract creator / admin)
    admin = scenario.test_account("Admin")
    buyer = scenario.test_account("Buyer")
    buyer2 = scenario.test_account("Buyer2")
    new_admin = scenario.test_account("NewAdmin")

    # Initialize contract with admin address
    c1 = main.LickAuction(admin=admin.address)
    scenario += c1

    # Initial admin should be the creator
    scenario.h2("Initial admin")
    scenario.verify(c1.data.admin == admin.address)

    # Admin can add an artwork
    scenario.h2("Add artwork (admin)")
    c1.add_artwork("artwork-1", _sender=admin)

    # Non-admin cannot add artwork
    scenario.h2("Add artwork (non-admin) - should fail")
    c1.add_artwork("artwork-2", _sender=buyer, _valid=False)

    # Buyer can pay for the artwork
    scenario.h2("Pay for artwork")
    c1.pay_for_artwork("artwork-1", _sender=buyer, _amount=sp.tez(1))
    scenario.verify(c1.data.pending["artwork-1"].amount == sp.tez(1))

    # Multiple payments at same timestamp accumulate
    scenario.h2("Multiple payments at same timestamp - should accumulate")
    c1.pay_for_artwork("artwork-1", _sender=buyer2, _amount=sp.tez(2))
    scenario.verify(c1.data.pending["artwork-1"].amount == sp.tez(3))

    # Payment at different timestamp finalizes previous and creates new
    scenario.h2("Payment at different timestamp")
    c1.pay_for_artwork("artwork-1", _sender=buyer, _amount=sp.tez(5), _now=sp.timestamp(100))
    scenario.verify(c1.data.pending["artwork-1"].amount == sp.tez(5))
    scenario.verify(sp.len(c1.data.artworks["artwork-1"]) == 1)

    # Another payment at different timestamp
    c1.pay_for_artwork("artwork-1", _sender=buyer, _amount=sp.tez(2), _now=sp.timestamp(200))
    scenario.verify(c1.data.pending["artwork-1"].amount == sp.tez(2))
    scenario.verify(sp.len(c1.data.artworks["artwork-1"]) == 2)

    # Cannot pay for non-existent artwork
    scenario.h2("Pay for non-existent artwork - should fail")
    c1.pay_for_artwork("artwork-999", _sender=buyer, _amount=sp.tez(1), _valid=False)

    # Cannot pay with zero amount
    scenario.h2("Pay with zero amount - should fail")
    c1.pay_for_artwork("artwork-1", _sender=buyer, _amount=sp.mutez(0), _valid=False)

    # Non-admin cannot update admin
    scenario.h2("Update admin (non-admin) - should fail")
    c1.update_admin(buyer.address, _sender=buyer, _valid=False)

    # Admin can update admin
    scenario.h2("Update admin (admin)")
    c1.update_admin(new_admin.address, _sender=admin)
    scenario.verify(c1.data.admin == new_admin.address)

    # Old admin can no longer add artwork
    scenario.h2("Old admin cannot add artwork after transfer")
    c1.add_artwork("artwork-3", _sender=admin, _valid=False)

    # New admin can add artwork
    scenario.h2("New admin can add artwork")
    c1.add_artwork("artwork-3", _sender=new_admin)

    # Non-admin cannot withdraw
    scenario.h2("Withdraw (non-admin) - should fail")
    c1.withdraw(_sender=buyer, _valid=False)

    # Admin can withdraw funds
    scenario.h2("Withdraw (admin)")
    # First, add some funds to the contract
    c1.pay_for_artwork("artwork-3", _sender=buyer, _amount=sp.tez(10), _now=sp.timestamp(300))
    # Balance includes all previous payments: 1 + 2 + 5 + 2 + 10 = 20 tez
    scenario.verify(c1.balance == sp.tez(20))
    # Withdraw as admin (new_admin is now the admin)
    c1.withdraw(_sender=new_admin)
    scenario.verify(c1.balance == sp.tez(0))

    # Withdraw with zero balance (should succeed but transfer nothing)
    scenario.h2("Withdraw with zero balance")
    c1.withdraw(_sender=new_admin)
    scenario.verify(c1.balance == sp.tez(0))


