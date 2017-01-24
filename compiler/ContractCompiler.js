const Utils = require("./Utils");
const solc = require("solc");
const fs = require("fs");

class ContractCompiler {

    static getContractNameFromSource(source) {
        const re1 = /contract.*{/g;
        const re2 = /\s\w+\s/;
        return source.match(re1).pop().match(re2)[0].trim();
    }

    static loadContract(name) {
        const path = name.toLowerCase();
        return fs.readFileSync(path, 'utf8');
    }

    static writeFile(outputDirectory, filename, output){
        const outputPath = `${outputDirectory}/${filename}`;
        console.log("Writing " + outputPath + ".");
        fs.writeFileSync(outputPath, output, 'utf8', function(err) {
            if (err) {
                throw err;
            }
        });
        console.log("Successfully wrote " + filename + ".");
    }

    constructor(inputDirectory, outputDirectory) {
        this.inputDirectory = inputDirectory;
        this.outputDirectory = outputDirectory;
    }

    findContractFiles() {
        this.fileList = Utils.findFiles(this.inputDirectory, ".sol");
    }

    compileContracts() {
        this.findContractFiles();
        for (const file of this.fileList) {
            // Load the source
            const source = ContractCompiler.loadContract(file);
            // Extract the contract name from the source since it may be different than the file name
            const contractName = ContractCompiler.getContractNameFromSource(source);

            // Compile it
            console.log("Compiling " + contractName + ".");
            const compiled = solc.compile(source);
            if(compiled.errors) {
                const errors = [];
                const warnings = [];
                for(const item of compiled.errors) {
                    const regexError = /Error:/;
                    const regexWarning = /Warning:/;
                    if (item.match(regexError)) {
                        errors.push(item);
                    }
                    else if (item.match(regexWarning)) {
                        warnings.push(item);
                    }
                }
                if(errors.length > 0) {
                    console.log("Warning: Errors when compiling " + contractName + ":");
                    for (const error of errors) {
                        console.log(error);
                    }
                    continue;
                }
                if(warnings.length > 0) {
                    console.log("Warning: Warnings when compiling " + contractName + ":");
                    for (const error of warnings) {
                        console.log(error);
                    }
                }
            }

            // Get the bytecode and abi
            const bytecode = compiled["contracts"][contractName]["bytecode"];
            const abi = compiled["contracts"][contractName]["interface"];

            // Write the bytecode and abi
            ContractCompiler.writeFile(this.outputDirectory, `${contractName}.obj`, bytecode);
            ContractCompiler.writeFile(this.outputDirectory, `${contractName}.abi`, abi);
        }
    }
}

module.exports = ContractCompiler;