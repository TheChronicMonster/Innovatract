const { default: ContractsBase } = require("@maticnetwork/maticjs/dist/ts/common/ContractsBase");

var Innovatract = artifacts.require("./Innovatract.sol");

ContractsBase("Innovatract", function(users) {
    var innovatractInstance;

    it("creates a new user", function() {
        return Innovatract.deployed().then(function(instance) {
            return instance.UserCount();
        }).then(function(user) {
            AssertPlus.equal(user, 0);
        });
    });

    
});