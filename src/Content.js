import React, { useEffect, useState } from "react";
import Niko from "./contracts/Niko";
import StakingRewards from "./contracts/StakingRewards";


const Content = ({ account }) => {
  const [nikoContract, setNikoContract] = useState();
  const [stakingRewardsContract, setStakingRewardsContract] = useState();
  const [walletBalance, setWalletbalance] = useState(0);
  const [stakingBalance, setStakingbalance] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const convertToEther = (n) => {
    return window.web3.utils.fromWei(n.toString(), 'Ether')
  };

  const loadData = async () => {
    const web3 = window.web3;

    const networkId = await web3.eth.net.getId();

    const nikoData = Niko.networks[networkId];
    const stakingData = StakingRewards.networks[networkId];

    const nikoContract = new web3.eth.Contract(Niko.abi, nikoData.address);
    setNikoContract(nikoContract);
    const walletBalance = await nikoContract.methods.balanceOf(account).call();
    setWalletbalance(walletBalance);

    const stakingContract = new web3.eth.Contract(StakingRewards.abi, stakingData.address);
    setStakingRewardsContract(stakingContract);
    const stakingBalance = await stakingContract.methods.getStakes(account).call();
    setStakingbalance(stakingBalance);
  };

  return (
      <div id="content" className="mt-3">

        <table className="table table-borderless text-muted text-center">
          <thead>
          <tr>
            <th scope="col">Staking Balance</th>
            <th scope="col">Reward Balance</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{convertToEther(stakingBalance)} NKO</td>
            <td>0 NKO</td>
          </tr>
          </tbody>
        </table>

        <div className="card mb-4" >

          <div className="card-body">

            <form className="mb-3" onSubmit={(event) => {
              event.preventDefault()
            }}>
              <div>
                <label className="float-left"><b>Stake Tokens</b></label>
                <span className="float-right text-muted">
                  Balance: {convertToEther(walletBalance)}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="0"
                    required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png" height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; NKO
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">STAKE!</button>
            </form>
            <button
                type="submit"
                className="btn btn-link btn-block btn-sm"
                onClick={(event) => {
                  event.preventDefault()
                }}>
              UN-STAKE...
            </button>
          </div>
        </div>

      </div>
  );
};

export default Content;
