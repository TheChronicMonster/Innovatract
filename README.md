# Innovatract
A smart contract that enables users to enter binding contracts with themselves

### Run Instructions

To use the front-end application, [clone the repository](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository-from-github/cloning-a-repository)
`cd Innovatract`
`npm install`
`cd client && npm run start`

This will open the front-end user interface on `localhost://3000`
Navigate to `localhost://3000/scr/index.html` to view the DApp.

Interact with the smart contract on Remix
Compile the `Innovatract.sol` contract in the `/contracts/` directory
Deploy at address `0xF9ef2665432bED830A28798c90E97Bb6AA9E5eB1`

Currently the DApp has the following functions:
`issueContract` to create a new contract
`fulfillContract` to initiate the fulfillment of a successfully completed contract
`acceptFulfillment` which validates the `fulfillContract function`
`unachievedContract` which sets the `goalStatus` to `UNACHIEVED`

### Future Plans

In the future, this DApp will be hosted on AWS for accessibility
A check in feature will be implemented to help guide users in their progress.
A DOA will be created with a goverening body to help determine the authenticity of goals stated as being `ACHIEVED`.

### Acknowledgements

The Solidity smart contract operates on the Polygon/Matic Blockchain and was a direct result of the work of Mark and Martin Adams. Check out Mark's TED talk before plunging headfirst into the [cult of extreme productivity](https://www.youtube.com/watch?v=2paoNvG5Nmo&list=PLYGuL9Tilhs0t4LowumYeYWKN0oTChoQE).

We stand on the shoulders of giants. Guidance and help were sourced from GlobalETH, Fluence Labs, Polygon/matic documentation, and kauri.io. Stack Overflow and countless blogs were also consulted in the making of this DApp. This service exists thanks to the knowledge that countless engineers have shared and published. This is our offering as a way to support and give back to communities that have shared so much.

Created by JP Miller, David Pius, Ilya Kostin, and research performed by Azim Anuar