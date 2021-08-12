// const { default: Web3Client } = require("@maticnetwork/maticjs/dist/ts/common/Web3Client");
//const Web3 = require("Web3");
// const Matic = require("@maticnetwork/maticjs").default;

App= {
    web3Provider: null,
    contracts: {},
    account: "0x0",

    init: function() {
        return App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3Client(web3.currentProvider);
        } else {
            App.web3Provider = new Web3Client.providers.HttpProvider("http://localhost:7545");
            web3 = new Web3Client(App.web3Provider);
        }
        return App.initContract();
        },

        initContract: function() {
            $.getJSON("Innovatract.json", function(innovatract) {
                App.contracts.Innovatract = TruffleContract(innovatract);
                App.contracts.Innovatract.setProvider(App.web3Provider);

                return App.render();
            });
        },

        render: function() {
            var innovatractInstance;
            var loader = $("#loader");
            var content = $("#content");

            loader.show();
            content.hide();

            // Load account data
            web3.eth.getCoinbase(function(err, account) {
                if (err === null) {
                    App.account = account;
                    $("#accountAddress").html("Your Account: " + account);
                }
            });

            App.contracts.Election.deployed().then(function(instance) {
                innovatractInstance = instance;
                return innovatractInstance.createUser();
            }).then(function(createUser) {
                var userDetails = $("#userDetails");
                userDetails.empty();

                for (i = 1; i <= createUser; i++) {
                    innovatractInstance.users(i).then(function(user) {
                        var id = user;
                        var contractName = user.GoalName;
                        var stakeAmount = user.StakeAmount;
                        var endDate = user.EndDate;

                        // Render information
                        var InnovatractContractTemplate = "<tr><th>" + id + "</th><td>" + contractName + "</td><td>" + stakeAmount + "</td><td>" + endDate + "</td></tr>"
                        userDetails.append(InnovatractContractTemplate);
                    });
                }

                loader.hide();
                content.show();
            }).catch(function(error) {
                console.warn(error);
            });
        }
};

// $(function() {
//     $(window).load(function() {
//         App.init();
//     });
// });

$(function() {
    setTimeout(function() {
      $("body").addClass("hidden")
    }, 100);
    setTimeout(function() {
      $(".preloader").addClass("end")
    }, 1800);
    setTimeout(function() {
      $(".global-overlay").addClass("show")
    }, 1900);
    setTimeout(function() {
      $("body").removeClass("hidden")
    }, 2300);
  });