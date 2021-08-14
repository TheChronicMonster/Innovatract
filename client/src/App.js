import React, { Component } from "react";
import InnovatractContract from "./contracts/Innovatract.json";
import getWeb3 from "./getWeb3";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable';
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

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
      contracts: [],
      account: null,
      web3: null
    }

    this.handleIssueContract = this.handleIssueContract.bind(this)
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
  async handleIssueContract(event)
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

    // Event listener

    addEventListener(component) {
    
      this.state.innovatractInstance.events.ContractIssued({fromBlock: 0, toBlock: "latest"})
      .on("data", function(event){
        console.log(event);
        var newContractsArray = component.state.contracts.setLastTransactionDetails()
        newContractsArray.push(event.returnValues)
        component.setState({ contracts: newContractsArray })
      })
      .on('error', console.error);
    }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Innovatract</h1>
        <h2>A single party contract to achieve rapid personal innovation</h2>
        <Container>
          <Row>
            <a href={this.state.etherscanLink} target="_blank">Transaction Details</a>
          </Row>
          <Row>
            <Card>
              <Card.Title>Initiate a Contract</Card.Title>
              <Form onSubmit={this.handleIssueContract}>
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
                  <Form.Text>Enter goal information</Form.Text><br/>

                  <FormControl
                    type="text"
                    name="contractDeadline"
                    value={this.state.contractDeadline}
                    placeholder="Enter the contract deadline"
                    onChange={this.handleChange}
                  />
                  <Form.Text>Enter contract deadline in seconds since epoch</Form.Text><br/>

                  <FormControl
                    type="text"
                    name="stakeAmount"
                    value={this.state.stakeAmount}
                    placeholder="Enter your gwei stake amount"
                    onChange={this.handleChange}
                  />
                  <Form.Text>Enter contract stake amount</Form.Text><br/>
                  <p>By pressing the button, you are entering into an irrevocable and binding contract with yourself.</p>
                  <Button type="submit">Initiate Contract</Button>
                </FormGroup>
              </Form>
            </Card>
          </Row>
          <Row>
            <Card>
              <Card.Text>Issued Contracts</Card.Text>
              <BootstrapTable data={this.state.contracts} striped hover>
                <TableHeaderColumn isKey dataField="contract_id">ID</TableHeaderColumn>
                <TableHeaderColumn dataField="recipient">Recipient</TableHeaderColumn>
                <TableHeaderColumn dataField="goal">Goal</TableHeaderColumn>
                <TableHeaderColumn dataField="amount">Amount</TableHeaderColumn>
                <TableHeaderColumn dataField="date">End Date</TableHeaderColumn>
              </BootstrapTable>
            </Card>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
