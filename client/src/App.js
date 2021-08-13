import React, { Component } from "react";
import InnovatractContract from "./contracts/Innovatract.json";
import getWeb3 from "./getWeb3";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import HelpBlock from "react-bootstrap/lib/HelpBlock";
import Grid from "react-bootstrap/lib/Grid";
import Row from "react-bootstrap/Row";
import Panel from "react-bootstrap/lib/Panel";


import "./App.css";

const etherscanBaseUrl = "https://rinkeby.etherscan.io"

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      innovatractInstance: undefined,
      stakeAmount: undefined,
      contractData: undefined,
      contractDeadline: undefined,
      etherscanLink: "https://rinkeby.etherscan.io",
      account: null,
      web3: null
    }

    this.handleIssueBounty = this.handleIssueBounty.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = InnovatractContract.networks[networkId];
      const instance = new web3.eth.Contract(
        InnovatractContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ innovatractInstance: instance, web3: web3, account: accounts[0] }) 
      this.addEventListener(this)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // Handle form data change
  handleChange(event)
  {
    switch(event.target.name) {
      case "goalName":
        this.setState({"goalName": event.target.value})
        break;
      case "contractDeadline":
        this.setState({"contractDeadline": event.target.value})
        break;
      case "stakeAmount":
        this.setState({"stakeAmount": event.target.value})
        break;
      default:
        break;
    }
  }

  // Handle form submit
  async handleContractInitialization(event)
    {
     if (typeof this.state.innovatractInstance !== 'undefined') {
       event.preventDefault();
    let result = await this.state.innovatractInstance.methods.issueContract(this.state.contractData,this.state.contractDeadline).send({from: this.state.account, value: this.state.web3.utils.toWei(this.state.stakeAmount, 'ether')})
       this.setLastTransactionDetails(result)
     } 
    }

  // Set Transaction Details
  setLastTransactionDetails(result)
    {
      if(result.tx !== 'undefined')
      {
        this.setState({etherscanLink: etherscanBaseUrl+"/tx/"+result.tx})
      }
      else
      {
        this.setState({etherscanLink: etherscanBaseUrl})
      }
    }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Innovatract</h1>
        <h2>A single party contract to achieve rapid personal innovation</h2>
        <Grid>
          <Row>
            <a href={this.state.etherscanLink} target="_blank">Transaction Details</a>
          </Row>
          <Row>
            <Panel>
              <Panel.Heading>Initiate a Contract</Panel.Heading>
              <Form onSubmit={this.handleContractInitialization}>
                <FormGroup
                  controlId="fromCreateContract"
                >
                  <FormControl
                    componentClass="textarea"
                    name="goalName"
                    value={this.state.contractData}
                    placeholder="Enter the name of your Goal"
                    onChange={this.handleChange}
                  />
                  <HelpBlock>Enter goal information</HelpBlock><br/>

                  <FormControl
                    type="text"
                    name="contractDeadline"
                    value={this.state.contractDeadline}
                    placeholder="Enter the contract deadline"
                    onChange={this.handleChange}
                  />
                  <HelpBlock>Enter contract deadline in seconds since epoch</HelpBlock><br/>

                  <FormControl
                    type="text"
                    name="stakeAmount"
                    value={this.state.stakeAmount}
                    placeholder="Enter your gwei stake amount"
                    onChange={this.handleChange}
                  />
                  <HelpBlock>Enter contract stake amount</HelpBlock><br/>
                  <p>By pressing the button, you are entering into an irrevocable and binding contract with yourself.</p>
                  <Button type="submit">Initiate Contract</Button>
                </FormGroup>
              </Form>
            </Panel>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
