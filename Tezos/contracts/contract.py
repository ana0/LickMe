import smartpy as sp
from smartpy.templates import fa2_lib as fa2

# Import the FA2 base implementation
main = fa2.main


@sp.module
def my_module():
    import main

    class SimpleContract(sp.Contract):
        def __init__(self):
            self.init(stored_value=0)
        
        @sp.entry_point
        def set_value(self, value):
            sp.set_type(value, sp.TNat)
            self.data.stored_value = value
        
        @sp.entry_point
        def increment(self):
            self.data.stored_value += 1

    # Compilation target - uncomment if you need to compile without running tests
    # sp.add_compilation_target("SimpleContract", SimpleContract())

    @sp.add_test(name="SimpleContract")
    def test():
        scenario = sp.test_scenario("SimpleContract")
        scenario.h1("Simple Contract")
        
        # Initialize contract
        c1 = SimpleContract()
        scenario += c1
        
        # Test set_value
        scenario.h2("Set Value")
        c1.set_value(42).run()
        scenario.verify(c1.data.stored_value == 42)
        
        # Test increment
        scenario.h2("Increment")
        c1.increment().run()
        scenario.verify(c1.data.stored_value == 43)

