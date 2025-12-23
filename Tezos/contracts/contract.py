import smartpy as sp

@sp.module
def main():

    class LickAuction(sp.Contract):
        def __init__(self):
            self.data.stored_value=0
        
        @sp.entrypoint
        def set_value(self, value):
            self.data.stored_value = value
        
        @sp.entrypoint
        def increment(self):
            self.data.stored_value += 1


@sp.add_test()
def test():
    scenario = sp.test_scenario("LickAuction")
    scenario.h1("Lick Auction")
    
    # Initialize contract
    c1 = main.LickAuction()
    scenario += c1
    
    # Test set_value
    scenario.h2("Set Value")
    c1.set_value(42)
    scenario.verify(c1.data.stored_value == 42)
    
    # Test increment
    scenario.h2("Increment")
    c1.increment()
    scenario.verify(c1.data.stored_value == 43)

