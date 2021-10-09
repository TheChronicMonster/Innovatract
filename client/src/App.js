import React, { Component } from "react";
import InnovatractContract from "./contracts/Innovatract.json";
import getWeb3 from "./getWeb3";
import { setJSON, getJSON } from './utils/IPFS.js'
import Livepeer from './components/Livepeer.js';
import WakuComponent from './components/WakuComponent.js';

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

const etherscanBaseUrl = "https://etherscan.io"
const ipfsBaseUrl = "https://ipfs.infura.io/ipfs";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storageValue: 0,
      innovatractInstance: undefined,
      stakeAmount: undefined,
      contractData: undefined,
      contractEndDate: undefined,
      etherscanLink: "https://etherscan.io",
      contracts: [],
      account: null,
      web3: null
    };
    this.handleIssueContract = this.handleIssueContract.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
      this.addEventListener.bind(this)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.log(error);
    }
  };

      // Event listener
      // ContractIssued lives here

      addEventListener(component) {
    
        this.state.innovatractInstance.events.ContractIssued.bind({fromBlock: 0, toBlock: "latest"})
        .on("data", async function(event){
          var ipfsJson = {}
          try{
            ipfsJson = await getJSON(event.returnValues.data);
          }
          catch(e)
          {
  
          }
  
          if(ipfsJson.contractData !== undefined)
          {
            event.returnValues["contractData"] = ipfsJson.contractData;
            event.returnValues["ipfsData"] = ipfsBaseUrl+"/"+event.returnValues.data;
          }
          else {
            event.returnValues["ipfsData"] = "none";
            event.returnValues["contractData"] = event.returnValues["data"];
          }
  
          var newContractsArray = component.state.contracts.slice()
          newContractsArray.push(event.returnValues)
          component.setState({ contracts: newContractsArray })
        })
        .on('error', console.error);
      }

  // Handle form data change
  handleChange(event)
  {
    switch(event.target.name) {
      case "contractData":
        this.setState({"contractData": event.target.value})
        break;
      // case "goalName":
      //   this.setState({"goalName": event.target.value})
      //   break;
      case "contractEndDate":
        this.setState({"contractEndDate": event.target.value})
        break;
      case "contractStakeAmount":
        this.setState({"contractStakeAmount": event.target.value})
        break;
      default:
        break;
    }
  }

  // Handle form submit
  // IssueContract is not a function
  async handleIssueContract(event)
    {
     if (typeof this.state.innovatractInstance !== 'undefined') {
       event.preventDefault();
       const ipfsHash = await setJSON({ contractData: this.state.contractData });
       let result = await this.state.innovatractInstance.methods.issueContract.bind(ipfsHash,this.state.contractEndDate).send({from: this.state.account, value: this.state.web3.utils.toWei(this.state.contractStakeAmount, 'ether')})
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
        <Container>
          <Row>
            <a href={this.state.etherscanLink} target="_blank" rel="noopener noreferrer">Transaction Details</a>
          </Row>
          <Row>
            <Card>
              <Card.Title>Initiate a Contract</Card.Title>
              <Form onSubmit={() => this.handleIssueContract.bind(this)}>
                <FormGroup
                  controlId="fromCreateContract"
                >
                  <FormControl
                    componentclass="textarea"
                    name="contractData"
                    value={this.state.contractData || ''}
                    placeholder="Enter the details of your Goal"
                    onChange={this.handleChange.bind(this)}
                  />
                  <Form.Text>Enter goal information</Form.Text><br/>

                  <FormControl
                    type="text"
                    name="contractEndDate"
                    value={this.state.contractEndDate || ''}
                    placeholder="Enter the contract end date"
                    onChange={this.handleChange.bind(this)}
                  />
                  <Form.Text>Enter contract end date in seconds since epoch</Form.Text><br/>

                  <FormControl
                    type="text"
                    name="contractStakeAmount"
                    value={this.state.contractStakeAmount || ''}
                    placeholder="Enter your gwei stake amount"
                    onChange={this.handleChange.bind(this)}
                  />
                  <Form.Text>Enter contract stake amount in gwei</Form.Text><br/>
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
                <TableHeaderColumn dataField="owner">Owner</TableHeaderColumn>
                <TableHeaderColumn dataField="contractStakeAmount">Amount</TableHeaderColumn>
                <TableHeaderColumn dataField="ipfsData">Goal Information</TableHeaderColumn>
                <TableHeaderColumn dataField="contractData">Goal Information</TableHeaderColumn>
              </BootstrapTable>
            </Card>
          </Row>
        </Container>
        <br />
        <Livepeer />
        <WakuComponent />
      </div>
    );
  }
}

export default App;
