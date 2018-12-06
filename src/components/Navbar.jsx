import React from 'react';


let Navbar = () => {
  return (
    <nav className="bg-dark bg-black-alpha pt-2 pb-2 fixed-top">
      <div className="container-fluid">
        <div className="row">
          <div className="col-6 v-center">
            <a className="nav-link text-white hover-warning" href="/"><strong><em>Reactive Crypto-Ticker Dashboard</em></strong></a>
            <br className="d-none" />
            <br className="d-none" />
          </div>
          <div className="col-6 v-center d-flex flex-row-reverse">
            <a className="icon-sm icon-github" href="https://github.com/kanthgithub/rxCryptoTicker"><span className="d-none">Github</span></a>
          </div>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
