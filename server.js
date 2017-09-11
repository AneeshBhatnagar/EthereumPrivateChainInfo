var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');
const Web3 = require('web3');


var web3 = new Web3();
const web3Admin = require('web3admin');
web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8101'))

setTimeout(function(){
    web3Admin.extend(web3)
    console.log("Extended");
    console.log(web3.admin.nodeInfo)
    console.log(web3.admin.peers)
 }, 1000);

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//Starting the application on port 8080
app.listen(8080);
console.log("App listening on port 8080");

console.log("App started!");
console.log(web3.eth.accounts);
console.log(web3)
