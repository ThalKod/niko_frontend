import React, { useEffect, useState } from "react";
import Web3 from "web3";

import Nav from "./Nav";
import Content from "./Content";


import './App.css';

function App() {
  const [account, setAccount] = useState("");
  const [wrongNetworkError, setWrongNetworkError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initWeb3();
    loadAccount();

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

  const loadAccount = async () => {
    const web3 = window.web3;

    const networkId = await web3.eth.net.getId();
    if(networkId !== 3)
      return setWrongNetworkError(true);

    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    setLoading(false);
  };

  const LoadingSpinner = () => {
    return (
        <p id="loader" className="text-center">Loading...</p>
    )
  };

  return (
    <div className="App">
      { wrongNetworkError && <div className="alert alert-danger" role="alert">Wrong NetWork !, Please use Ropsten tesnet !</div>}
      <Nav account={account}/>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
            <div className="content mr-auto ml-auto">
              <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
              >
              </a>
              {loading? <LoadingSpinner /> :  <Content account={account}/> }
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}



export default App;
