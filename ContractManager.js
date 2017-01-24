const Utils = require("./compiler/Utils");
const fs = require("fs");

class CachedContract {

    constructor(name, bytecode, abi) {
        this.name = name;
        this.bytecode = bytecode;
        this.abi = abi;
    }

    debugLog() {
        console.log("NAME: " + this.name);
        console.log("BYTECODE: " + this.bytecode);
        console.log("ABI: " + this.abi);
    }
}

class ContractManager {

    constructor(web3, inputDirectory) {
        this.web3 = web3;
        this.inputDirectory = inputDirectory;
    }

    findContractFiles() {
        this.objList = Utils.findFiles(this.inputDirectory, ".obj");
        this.abiList = Utils.findFiles(this.inputDirectory, ".abi");
    }

    loadContracts() {
        this.findContractFiles();
        this.cachedContracts = [];

        for (const file of this.objList) {
            // Get the contract name from the file name of the compiled bytecode (not including the extension)
            const contractName = file.match(/\w+/g).fromLast(1);
            const basePath = `${this.inputDirectory}/${contractName}`;

            // Sanity check
            if (this.objList.indexOf(`${basePath}.obj`) == -1) {
                console.log("Warning: Contract " + contractName + " has no bytecode. This contract will not load.");
                continue;
            }

            // Make sure a corresponding abi exists too
            if (this.abiList.indexOf(`${basePath}.abi`) == -1) {
                console.log("Warning: Contract " + contractName + " has bytecode but no abi. This contract will not load.");
                continue;
            }

            console.log("Loading " + contractName + ".");

            try {
                const bytecode = fs.readFileSync(`${basePath}.obj`, 'utf8');
                const abi = fs.readFileSync(`${basePath}.abi`, 'utf8');

                const cachedContract = new CachedContract(contractName, bytecode, abi);
                this.cachedContracts.push(cachedContract);

                console.log("Successfully loaded contract " + contractName + ".");
            }
            catch (err) {
                console.log("Warning: Unable to load contract " + contractName + ": " + err);
            }
        }
    }

    createContract(cachedContract, options = {}) {
        const bytecode = cachedContract.bytecode;
        const abi = cachedContract.abi;

        // How much will this bytecode cost?
        const gasEstimate = this.web3.eth.estimateGas({ data: bytecode });

        // Create the contract
        const parsedABI = JSON.parse(abi);
        const contract = this.web3.eth.contract(parsedABI);

        const deployed = contract.new(
            Object.assign({
                    from: this.web3.eth.accounts[0],
                    data: bytecode,
                    gas: gasEstimate,
                    gasPrice: 5
                },
                options),
            (error, result) => {
                if (error) {
                    console.log("Failed to deploy contract " + cachedContract.name + ": " + error.toString());
                }
                else {
                    console.log("Deployed contract " + cachedContract.name + ": " + result.toString());
                }
            }
        );
        return deployed;
    }

    deployContract(name, options = {}) {
        const contract = this.cachedContracts.find((contract) => { return contract.name == name; });
        console.log("Deploying " + contract.name + ".");
        return this.createContract(contract, options);
    }
}

exports.ContractManager = ContractManager;