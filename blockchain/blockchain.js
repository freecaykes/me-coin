var ChainList = require('./chainlist.js');
const SHA256 = require('crypto-js/sha256');

const ZERO = '0';

class Block {

    constructor( data, previous ){
        this.timestamp = this.date();
        this.data = data;
        this.previous = previous;
        this.previousHash = this.previous ? this.previous.hash : ''; 
        this.hash = '';
        this.nonce = 0;
    }   

    hash() {
        var hash_s256 = SHA256( this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce);
        return hash_s256.toString();
    }   

    date() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        }
        if(mm<10) {
            mm = '0'+mm
        }
        today = mm + '-' + dd + 'i' + yyyy;
        return today;
    }   

    /** 
     * proof of work
     * @difficuly - length of prefix 0 before a block is created
     *
     **/
    mine( difficulty ) { 
        // num 0 prefix is difficulty
        while( this.hash.substring(0, difficulty) !== Array(difficulty + 1).join(ZERO) ){
            this.nonce++;
            this.hash = this.hash(); 
        }
    }   
} 

class BlockChain extends ChainList {


    constructor( block, difficulty ){
        super( block );
        this.difficulty = difficulty;
    }

    getDifficulty(){
        return this.difficulty;
    }

    setDifficulty( difficulty ){
        this.difficulty = difficulty;
    }

    genesis( data ) { 
        var genesisBlock = new Block( data, null);
        genesisBlock.mine( this.difficulty );
        
        return genesisBlock;
    }   

    getTail(){
        return this.tail;
    }   

    add( data ){
        var block = new Block( data, this.tail);
        block.mine(this.difficulty);
        super.add(block);

        return block;
    }   

    validChain(){
        if (! this.tail ){
            return false;
        }

        var current = this.tail;
        
        while( current.previous != null){
            if (current.previousHash != current.previous.hash ){
                return false;
            }

            current = current.previous;
        }

        return true;
    }

    length(){
        if (! this.tail ){
            return 0;
        }
        
        var current = this.tail;
        var len = 1;
        while( current.previous != null){
            len++;
        }

        return len;
    }

}