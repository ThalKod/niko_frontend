import React from "react";

const Nav = ({ account }) => {
  return(
      <nav className="navbar navbar-dark  bg-dark flex-md-nowrap p-0 shadow">
        <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="/"
        >
          <img src={"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png"} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; Niko
        </a>

        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">{account}</small>
            </small>
          </li>
        </ul>
      </nav>
  )
};

export default Nav;
