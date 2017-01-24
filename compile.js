const ContractCompiler = require("./compiler/ContractCompiler");

const contractCompiler = new ContractCompiler("./contracts", "./contracts/bin");
contractCompiler.compileContracts();