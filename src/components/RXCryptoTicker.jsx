import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';

let CRYPTOTICKER_STATIC_DATA_API = "https://cryptostreamingapi.herokuapp.com/tickerData";
let CRYPTOTICKER_STREAMING_DATA_API = "wss://cryptostreamingapi.herokuapp.com";


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

        // Subscribe via connecting to cryptostreamingapi websocket API.
        let cryptoIO = io.connect(CRYPTOTICKER_STREAMING_DATA_API);

        cryptoIO.on("m", (message) => {
            this.updateCryptoTickerState(message);
        });
    };

    updateCryptoTickerState = (message) => {
        // Update tickerEntity with recent data from cryptostreamingapi websocket API.

        console.log("message for state update: "+message);

        if(message){
            this.setState({ "tickerStaticEntities": message });
        }

        console.log("current state after update: "+JSON.stringify(this.state.tickerStaticEntities));


           //   Reset tickerEntity status after short interval. This is needed to reset
            //  css class of tick animation when tickerEntity's value goes up or down again.

            setTimeout(() => {

               var tickerStaticEntitiesLocal = Object.assign({}, this.state.tickerStaticEntities);

                this.setState({ "tickerStaticEntities": tickerStaticEntitiesLocal });

                tickerStaticEntitiesLocal[message.symbol].goingup = false;
                tickerStaticEntitiesLocal[message[2]].goingdown = false;

                this.setState({ "tickerStaticEntities": tickerStaticEntitiesLocal })
            }, 500);

        };

    getTickStyle = (tickerEntity) => {
        // Return css style based on tickerEntity status.
        if (tickerEntity.goingup) {
            return " tickGreen ";
        } else if (tickerEntity.goingdown) {
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
                                        <p className="text-white m-0">{ tickerEntity.price }</p>
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
