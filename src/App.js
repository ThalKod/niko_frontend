import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Nav from "./Nav";

import './App.css';

function App() {
  const [account, setAccount] = useState("");
  const [wrongNetworkError, setWrongNetworkError] = useState(false);

  useEffect(() => {
    initWeb3();
    loadBlockChainData();

    window.ethereum.on('accountsChanged', (accounts) => setAccount(accounts[0]));
    window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
  }, []);

  const initWeb3 = async () => {
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum);
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Please Download an Ethereum compatible browser...')
    }
  };

  const loadBlockChainData = async () => {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const networkId = await web3.eth.net.getId();
    if(networkId !== 3)
      setWrongNetworkError(true)
  };

  return (
    <div className="App">
      { wrongNetworkError && <div className="alert alert-danger" role="alert">Wrong NetWork !, Please use Ropsten tesnet !</div>}
      <Nav account={account}/>
    </div>
  );
}



export default App;
