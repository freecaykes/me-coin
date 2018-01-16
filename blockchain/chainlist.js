class ChainList {

    constructor( tail ){
        this._length = 0;
        this.tail = tail;
    }
    
    add(node) {
        var currentNode = this.tail;
         
        // an empty list
        if (!currentNode) {
            this.tail = node;
            this._length++;
            return node;
        }

        node.previous = currentNode;
        this.tail = node;
        this._length++;                                           
        
        return this.tail;
    }

    get(index) {
        var currentNode = this.tail,
            length = this._length,
            count = this._length - index,
            message = {failure: 'Failure: non-existent node in this list.'};
        
        // 1st use-case: an invalid index
        if (length === 0 || index < 1 || index > length) {
            throw new Error(message.failure);
        }
     
        // 2nd use-case: a valid index
        while ( count > 0) {
            currentNode = currentNode.previous;
            count--;
        }
     
        return currentNode;
    }
}

module.exports = ChainList;

