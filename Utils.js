// Convenience functions for arrays
if (!Array.prototype.fromLast) {
    Array.prototype.fromLast = function(index = 0) {
        return this[this.length - (1 + index)];
    };
}
if (!Array.prototype.last) {
    Array.prototype.last = function() {
        return this.fromLast();
    };
}

class Utils {
    static getEtherBalance(contract) {
        switch(typeof(contract)) {
            case "object":
                if (contract.address) {
                    return global.web3.fromWei(global.web3.eth.getBalance(contract.address), 'ether').toNumber();
                }
                else {
                    return new Error("Cannot call getEtherBalance on an object with property 'address.'");
                }
                break;
            case "string":
                return global.web3.fromWei(global.web3.eth.getBalance(contract), 'ether').toNumber();
                break;
        }
    }
}

module.exports = Utils;