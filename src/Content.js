import React, { useEffect, useState } from "react";
import Niko from "./contracts/Niko";
import StakingRewards from "./contracts/StakingRewards";


const Content = ({ account }) => {
  const [nikoContract, setNikoContract] = useState();
  const [stakingRewardsContract, setStakingRewardsContract] = useState();
  const [stakingAddress, setStakingAddress] = useState();
  const [walletBalance, setWalletbalance] = useState(0);
  const [stakingBalance, setStakingbalance] = useState(0);
  const [rewardsBAlance, setRewardsBalance] = useState(0);
  const [loadingStake, setLoadingStake] =useState(false);
  const [loadingUnstake, setLoadingUnstake] =useState(false);
  const [loadingClaim, setLoadingClaim] =useState(false);
  const [input, setInput] = useState(0);

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

    setStakingAddress(stakingData.address);
    const stakingContract = new web3.eth.Contract(StakingRewards.abi, stakingData.address);
    setStakingRewardsContract(stakingContract);
    const stakingBalance = await stakingContract.methods.getStakes(account).call();
    setStakingbalance(stakingBalance);

    const rewardsBalance = await stakingContract.methods.getRewards(account).call();
    setRewardsBalance(rewardsBalance);
  };

   const stakeToken = async () => {
     setLoadingStake(true);
     console.log("Stake !", input);
     const amountToStake = window.web3.utils.toWei(input, 'Ether');
     console.log("Address", stakingAddress);
     const approve = await nikoContract.methods.approve(stakingAddress, amountToStake).send({ from: account});
     console.log("approve", approve);
     const stake = await stakingRewardsContract.methods.createStake(amountToStake).send({from: account});
     console.log("stake", stake);
     setLoadingStake(false);
   };

   const unstakeToken =  async () => {
     setLoadingUnstake(true);
     const unstake = await stakingRewardsContract.methods.removeStake(stakingBalance).send({from: account});
     console.log("unstake", unstake);
     setLoadingUnstake(false);
   };

  const claimRewards = async () => {
    setLoadingClaim(true);
    const claim = await stakingRewardsContract.methods.claimRewards().send({from: account});
    console.log("claim", claim);
    setLoadingClaim(false);
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
            <td>{convertToEther(rewardsBAlance)} NKO</td>
          </tr>
          </tbody>
        </table>

        <div className="card mb-4" >

          <div className="card-body">

            <form className="mb-3" onSubmit={(event) => {
              event.preventDefault();
              stakeToken(event);
            }}>
              <div>
                <label className="float-left"><b>Stake Tokens</b></label>
                <span className="float-right text-muted">
                  Balance: {convertToEther(walletBalance)}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                    type="number"
                    className="form-control form-control-lg"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png" height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; NKO
                  </div>
                </div>
              </div>
              <button disabled={loadingStake} type="submit" className="btn btn-primary btn-block btn-lg">
                {loadingStake? <div className="spinner-border text-center" role="status" /> : "STAKE" }
              </button>
            </form>
            <button
                disabled={loadingUnstake}
                type="submit"
                className="btn btn-link btn-block btn-sm"
                onClick={(event) => {
                  event.preventDefault();
                  unstakeToken();
                }}>
              {loadingUnstake? <div className="spinner-border text-center" role="status" /> : "UN-STAKE" }
            </button>
            <button
                disabled={loadingClaim}
                type="submit"
                className="btn btn-link btn-block btn-sm"
                onClick={(event) => {
                  event.preventDefault();
                  claimRewards();
                }}>
              {loadingClaim? <div className="spinner-border text-center" role="status" /> : "CLAIM REWARDS" }
            </button>
          </div>
        </div>

      </div>
  );
};

export default Content;
