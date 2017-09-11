const Web3 = require('web3');
var web3 = new Web3();

const web3Admin = require('web3admin');
web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8101'))

setTimeout(function(){
    web3Admin.extend(web3)
    console.log("Extended");
    console.log(web3.admin.nodeInfo)
    console.log(web3.admin.peers)
 }, 1000)

console.log("App started!");
console.log(web3.eth.accounts);
console.log(web3)
