import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';


let CRYPTOCOMPARE_API = "https://streamer.cryptocompare.com/";
let CRYPTOTICKER_STATIC_DATA_API = "https://cryptostreamingapi.herokuapp.com/tickerData";


class RXCryptoTicker extends React.Component {

    constructor() {
        super();
        this.state = {
            "tickerStaticEntities": {}
        };
    };

    componentWillMount() {
        this.getTickerStatic();
    };

    getTickerStatic = () => {

        // Get all available tickers from  cryptoTickerStatic-API.
        axios.get(CRYPTOTICKER_STATIC_DATA_API).then((response) => {
            if (response.status === 200) {

                let tickerStaticEntities = {};

                console.log(response);

                response.data.map((tickerStatic) => {

                    tickerStaticEntities[tickerStatic.symbol] = tickerStatic
                    return null
                });

                this.setState({ "tickerStaticEntities": tickerStaticEntities });
                this.subscribeCryptoStream();
            }else{
                console.log("error for tickerStaticEntity fetch");
            }
        });
    };

    subscribeCryptoStream = () => {

        // Subscribe to CryptoCompare websocket API.
        let subs = [];

        let cryptoIO = io.connect(CRYPTOCOMPARE_API);

        Object.keys(this.state.tickerStaticEntities).map((key) => {
            return subs.push("5~CCCAGG~"+ key +"~USD");
        });

        cryptoIO.emit("SubAdd", { "subs": subs });

        cryptoIO.on("m", (message) => {
            this.updateCryptoTickerState(message);
        });
    };

    updateCryptoTickerState = (message) => {
        // Update tickerEntity with recent data from CryptoCompare websocket API.

        message = message.split("~");
        let tickerStaticEntitiesLocal = Object.assign({}, this.state.tickerStaticEntities);

        if ((message[4] === "1") || (message[4] === "2")) {

            if (message[4] === "1") {
                tickerStaticEntitiesLocal[message[2]].goUp = true;
                tickerStaticEntitiesLocal[message[2]].goDown = false;
            }
            else if (message[4] === "2") {
                tickerStaticEntitiesLocal[message[2]].goUp = false;
                tickerStaticEntitiesLocal[message[2]].goDown = true;
            }
            else {
                tickerStaticEntitiesLocal[message[2]].goUp = false;
                tickerStaticEntitiesLocal[message[2]].goDown = false;
            }

            tickerStaticEntitiesLocal[message[2]].price_usd = message[5];
            this.setState({ "tickerStaticEntities": tickerStaticEntitiesLocal });

            /*
              Reset tickerEntity status after short interval. This is needed to reset
              css class of tick animation when tickerEntity's value goes up or down again.
            */
            setTimeout(() => {
                tickerStaticEntitiesLocal = Object.assign({}, this.state.tickerStaticEntities)
                tickerStaticEntitiesLocal[message[2]].goUp = false
                tickerStaticEntitiesLocal[message[2]].goDown = false
                this.setState({ "tickerStaticEntities": tickerStaticEntitiesLocal })
            }, 500);

        };
    };

    getTickStyle = (tickerEntity) => {
        // Return css style based on tickerEntity status.
        if (tickerEntity.goUp) {
            return " tickGreen ";
        } else if (tickerEntity.goDown) {
            return " tickRed ";
        } else {
            return " ";
        }
    };

    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div className="row">
                        {Object.keys(this.state.tickerStaticEntities).map((key, index) => {

                            let tickerEntity = this.state.tickerStaticEntities[key]

                            return (
                                <div key={ index } className="col-4 col-sm-3 col-xl-2 p-0">
                                    <div className={"stock " + this.getTickStyle(tickerEntity) }>
                                        <p className="text-white m-0">{ tickerEntity.symbol }</p>
                                        <p className="text-white m-0">{ tickerEntity.price_usd }</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    };
};


export default RXCryptoTicker;
