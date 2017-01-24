class RPCConfig {
    constructor(host, port) {
        this.host = host;
        this.port = port;
    }

    static getDefaultConfig() {
        const defaultHost = "localhost";
        const defaultPort = "8545";
        return new RPCConfig(defaultHost, defaultPort);
    }
}

class Config {
    constructor(rpc) {
        this.rpc = rpc;
    }

    get rpcAddress() {
        const address = `http://${this.rpc.host}:${this.rpc.port}`;
        return address;
    }
}

exports.RPCConfig = RPCConfig;
exports.Config = Config;