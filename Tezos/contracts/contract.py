import smartpy as sp

@sp.module
def main():

    class LickAuction(sp.Contract):
        def __init__(self, admin):
            # Basic storage, including admin address
            self.data.stored_value = 0
            self.data.admin = admin

        @sp.entrypoint
        def set_value(self, value):
            self.data.stored_value = value

        @sp.entrypoint
        def increment(self):
            self.data.stored_value += 1

        @sp.entrypoint
        def update_admin(self, new_admin):
            """Admin-gated: update the admin address."""
            sp.set_type(new_admin, sp.TAddress)
            sp.verify(sp.sender == self.data.admin, message="NOT_ADMIN")
            self.data.admin = new_admin


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

    # Test set_value
    scenario.h2("Set Value")
    c1.set_value(42)
    scenario.verify(c1.data.stored_value == 42)

    # Test increment
    scenario.h2("Increment")
    c1.increment()
    scenario.verify(c1.data.stored_value == 43)

