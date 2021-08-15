const path = require("path");
const fs = require("fs");
const solc = require("solc");

const innovatractPath = path.resolve(__dirname, "contracts", "Innovatract.sol");
const source = fs.readFileSync(innovatractPath, "UTF-8");

var input = {
    language: "Solidity",
    sources: {
        "Innovatract.sol" : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            "*": {
                "*": [ "*" ]
            }
        }
    }
};

module.exports = console.log(JSON.parse(solc.compile(JSON.stringify(input))));

//module.exports = solc.compile(source, 1).contracts[':Innovatract'];
//console.log(solc.compile(source, 1))