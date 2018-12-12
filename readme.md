<h1>TICKER - Real time cryptotransactions ticker</h1>

## Technology Stack:

<ul>
<li>nodeJS</li>
<li>reactJS</li>
<li>axios</li>
<li>socket.io</li>
</ul>

## Streaming:

- Streaming is done via CryptoStreamingAPI Streamer
- CryptoStreamingAPI has finer streaming control on CryptoTickers
- CryptoStreamingAPI is the backend module and accessible @ https://github.com/kanthgithub/cryptodashboard

- streamer will internally make regular API-calls to coinmarketcap-api to get the marketdata snapshot of the preferred tickers choosen by user OR default tickers

  - Market data is extracted from coinmarketcap API call
  
- Websocket streaming of marketdata

  1. MarketdataStreamer picks the marketdata from API and caches in the local cache
  
  2. Each extraction of marketdata-snapshot will compare the results with cached data
 
     - If there is any price change, then the corresponding increase/decrease of price will be marked as indicator
     - A Px increase will make boolean indicator 'goingup' as true, and viceversa, fall in Px will set indicator 'goingdown'
     - Default would be false for both

Basic usage of reactive crypto-Ticker Dashboard and approach used in this solution is:

- Streaming URL: ws://cryptostreamingapi.herokuapp.com

- socket.io-client is used to connect/subscribe to market updates

<h3>Live demo: <a href="https://rxcryptoticker.herokuapp.com/">https://rxcryptoticker.herokuapp.com/</a></h3>

<img src="docs/img/Reactive_Crypto_Ticker_Dashboard_Snapshot.png">

<h3>Requirements:</h3>
<ul>
  <li><a href="https://git-scm.com">Git</a> and <a href="https://nodejs.org">Node</a> installed</li>
  <li>No API keys required</li>
</ul>

<h3>Local deployment:</h3>
<ol>
  <li>Enter command line</li>
  <li>Clone repository: <code>git clone https://github.com/kanthgithub/rxCryptoTicker.git</code></li>
  <li>Enter repository: <code>cd rxCryptoTicker</code></li>
  <li>Install packages: <code>npm install</code></li>
  <li>Run with: <code>npm start</code></li>
  <li>Browse: <code>http://127.0.0.1:3000</code></li>
  <li>Stop with: <code>CTRL+C</code></li>
</ol>

<p>This application uses: <br/>
 <a href="https://coinmarketcap.com/api/">CoinMarketCap API</a> for Crypto-Ticker-Static <br/>
 <a href="ws://cryptostreamingapi.herokuapp.com">CryptoCompare WebSocket API</a> to listen market-data updates.</p>

