var CryptoJS = require("crypto-js");
var https = require('https');
var bodyParser = require('body-parser');
var WebSocket = require("ws");
var express = require('express');

var BlockChain = require('../blockchain/blockchain.js');


// express server
var port = process.env.PORT || 8564;
var sockets = [];

var difficulty = 0;
var genesisBlock = null;
var blockchain = null;

var TYPE = {
    ERROR: -1
};

// Message Passing

/**
* send message to socket ws
*
* @ws - socket to send message out of
* @message - in JSON format
*
**/
var send = (ws, message) => ws.send(JSON.stringify(message));

/**
* send message to all peers
*
* @message - in JSON format
*
**/
var broadcast = (message) => sockets.forEach(socket => send(socket, message));


var connect = (ws) => {
    sockets.push(ws);
    send(ws, blockchain.length());
};

// P2P API to control Blockchain

/**
*
* p2p API handler
*
**/

var initHttpServer = () => {
    var app = express();
    app.use(bodyParser.json());

    /**
    * '/blockchain' - get blockchain list as json
    *
    * @return - blockchain => type: Blockchain if blockchain is not null
    * 		  - ERROR: Message "BlockChain not instantiated"
    */
    app.get( ('/blockchain', (req, res) => {
    	if(blockchain){
    		res.send(JSON.stringify(blockchain));
    	} else{
    		var ERROR_NULL_BLOCKCHAIN = {
    			type: TYPE.ERROR,
    			content: "BlockChain not instantiated";
    		};
    		res.send(ERROR_NULL_BLOCKCHAIN);
    	}
    });

    /**
    * '/blockchain' - get blockchain list as json
    *
    * @return - blockchain => type: Blockchain if blockchain is not null
    * 		  - ERROR: Message "BlockChain not instantiated"
    */
    app.get( ('/blockchain/tail', (req, res) => {
    	if(blockchain){
    		res.send(JSON.stringify( blockchain.getTail() ));
    	} else{
    		var ERROR_NULL_BLOCKCHAIN = {
    			type: TYPE.ERROR,
    			content: "BlockChain not instantiated";
    		};
    		res.send(ERROR_NULL_BLOCKCHAIN);
    	}
    });

    /**
    * '/blockchain' - get blockchain list as json
    *
    * @return - blockchain => type: Blockchain if blockchain is not null
    * 		  - ERROR: Message "BlockChain not instantiated"
    */
    app.get( ('/blockchain/validate', (req, res) => {
    	if(blockchain){
    		try{
    			res.send( JSON.stringify( blockchain.validate() ));
    		} catch(error){
    			var ERROR_NON_EXISTENT_NODE = {
	    			type: TYPE.ERROR,
	    			content: error.message;
	    		};
	    		res.send(ERROR_NULL_BLOCKCHAIN);
    		}
    	}else{
    		var ERROR_NULL_BLOCKCHAIN = {
    			type: TYPE.ERROR,
    			content: "BlockChain not instantiated";
    		};
    		res.send(ERROR_NULL_BLOCKCHAIN);
    	}
    });



    /**
    * '/block/mine' - get blockchain list as json
    *
    * --data '{"data" : byte32 }'
    *
    * @return - blockchain => type: Blockchain if blockchain is not null
    * 		  - ERROR: Message "BlockChain not instantiated"
    */
    app.post('/block/mine', (req, res) => {
    	if( blockchain ){
	        var tail = blockchain.add(req.body.data);
	        broadcast( JSON.stringify([ blockchain.getTail() ]) );
	        console.log('block added: ' + JSON.stringify(tail));
	        res.send();
	    }else{
    		var ERROR_NULL_BLOCKCHAIN = {
    			type: TYPE.ERROR,
    			content: "BlockChain not instantiated";
    		};
    		res.send(ERROR_NULL_BLOCKCHAIN);
    	}

    });


    /**
    * '/peers' - get list of peers connected on the private network
    *
    * @return - sockets => type: list of  if blockchain is not null
    *
    */
    app.get('/peer/peers', (req, res) => {
        res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    
    /**
    * '/peer/join' - connect node with req on the private network
    *
    * @return - none
    * 
    */
    app.post('/peer/join', (req, res) => {
    	sockets.push( new WebSocket(peer) )

    	sockets.forEach((peer) => {
	        var ws = new WebSocket(peer);
	        ws.on('open', () => initConnection(ws));
	        ws.on('error', () => {
	            console.log('connection failed')
	        });
		});

        res.send();
	});


    app.listen(port, () => console.log('On port: ' + port));
};