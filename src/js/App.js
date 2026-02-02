import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import '../css/index.css'
import CasinoContract from '../../build/contracts/Casino.json'

class App extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         lastWinner: 0,
         numberOfBets: 0,
         minimumBet: 0,
         totalBet: 0,
         maxAmountOfBets: 0,
         web3: null,
         contractInstance: null,
         account: null
      }

      if (typeof web3 != 'undefined') {
         this.web3Provider = web3.currentProvider
      } else {
         this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545')
      }

      this.web3 = new Web3(this.web3Provider)
   }

   componentDidMount() {
      this.web3.eth.getAccounts((error, accounts) => {
         if (!error && accounts.length > 0) {
             this.setState({ account: accounts[0] })
             this.instantiateContract()
         } else {
             console.log("No accounts found or error connecting to Web3.")
         }
      })
   }

   instantiateContract() {
       const contract = this.web3.eth.contract(CasinoContract.abi)

       this.web3.version.getNetwork((err, netId) => {
           if (CasinoContract.networks[netId]) {
               const address = CasinoContract.networks[netId].address
               const instance = contract.at(address)
               this.setState({ contractInstance: instance })
               this.updateState()
               this.setupEvents()
           } else {
               console.error("Contract not deployed to detected network.")
           }
       })
   }

   setupEvents() {
       const instance = this.state.contractInstance
       instance.LogBet({}, { fromBlock: 0, toBlock: 'latest' }).watch((error, event) => {
           if (!error) this.updateState()
       })
       instance.LogWinner({}, { fromBlock: 0, toBlock: 'latest' }).watch((error, event) => {
           if (!error) {
               this.setState({ lastWinner: event.args.winnerNumber.toNumber() })
               this.updateState()
           }
       })
   }

   updateState() {
       const instance = this.state.contractInstance
       if (instance) {
           instance.minimumBet((err, result) => {
               if(!err) this.setState({ minimumBet: parseFloat(this.web3.fromWei(result, 'ether')) })
           })
           instance.totalBet((err, result) => {
               if(!err) this.setState({ totalBet: parseFloat(this.web3.fromWei(result, 'ether')) })
           })
           instance.numberOfBets((err, result) => {
               if(!err) this.setState({ numberOfBets: result.toNumber() })
           })
           instance.maxAmountOfBets((err, result) => {
               if(!err) this.setState({ maxAmountOfBets: result.toNumber() })
           })
       }
   }

   voteNumber(number) {
       if (this.state.contractInstance) {
           this.state.contractInstance.bet(number, {
               from: this.state.account,
               value: this.web3.toWei(this.state.minimumBet, 'ether'),
               gas: 300000
           }, (err, result) => {
               if (err) console.error(err)
               else console.log("Bet placed:", result)
           })
       }
   }

   render() {
      return (
         <div className="main-container">
            <h1>Casino Ethereum DApp</h1>
            <div className="block">
               <h4>Last Winner: <span>{this.state.lastWinner}</span></h4>
               <hr/>
               <h2>Vote for the next number</h2>
               <ul>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                     <li key={n} onClick={() => { this.voteNumber(n) }} style={{cursor: 'pointer', display: 'inline-block', padding: '10px', border: '1px solid black', margin: '5px'}}>
                        {n}
                     </li>
                  ))}
               </ul>
               <hr/>
               <p>Total bets: {this.state.numberOfBets} / {this.state.maxAmountOfBets}</p>
               <p>Total ether bet: {this.state.totalBet} ETH</p>
               <p>Minimum bet: {this.state.minimumBet} ETH</p>
               <p><i>Your Account: {this.state.account}</i></p>
            </div>
         </div>
      )
   }
}

export default App
