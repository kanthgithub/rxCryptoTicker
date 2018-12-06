import React from 'react';
import Navbar from './components/Navbar';
import rxCryptoTicker from './components/RxCryptoTicker';


let App = () => {
  return (
    <div>
      <Navbar />
      <rxCryptoTicker />
    </div>
  );
};


export default App;
