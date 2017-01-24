// Requires:

// Utils
global.Utils = require("./Utils");

// Web3 for ethereum
global.Web3 = require('web3');

const ContractManagerLib = require("./ContractManager");
const ContractManager = ContractManagerLib.ContractManager;

// Config
const ConfigLib = require("./config");
const Config = ConfigLib.Config;
const RPCConfig = ConfigLib.RPCConfig;

// Setup Config
const rpcConfig = RPCConfig.getDefaultConfig();
global.config = new Config(rpcConfig);

// Setup Web3
const provider = new Web3.providers.HttpProvider(config.rpcAddress);
global.web3 = new Web3();
web3.setProvider(provider);

global.acct0 = web3.eth.accounts[0];
global.acct1 = web3.eth.accounts[1];

// Setup Contract Manager
global.contractManager = new ContractManager(web3, "./contracts/bin");
contractManager.loadContracts();

// Repl
const repl = require("repl");
repl.start({});