var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');
const Web3 = require('web3');


var web3 = new Web3();
var sentPeers = []
const web3Admin = require('web3admin');
web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8102'));

var activePeers = [];

setTimeout(function(){
    web3Admin.extend(web3);
/*	console.log(getAllPeers())
    console.log(checkValidEnode("enode://89bebe3c427d47f783213ad98fa8a850411c74d83883372fa16dc31121e200c98bb8eda7973fa4332f25e4384532dd807c0d3e3a85d549ef8574592053dc1907@192.168.1.1:30301"));
    console.log(activePeers);
    console.log(updateActivePeers());
    console.log(activePeers);*/
 }, 1000);

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

//Starting the application on port 8080
app.listen(8080);
console.log("App listening on port 8080");

app.post('/api/newNode',function(req,res){
	//console.log(req.body);
	resp = checkValidEnode(req.body.enode);
	if(resp == -1)
		res.json({"status":"error","errorDetails":"Invalid enode entered"});
	if(resp == 0)
		res.json({"status":"error","errorDetails":"Invalid IP Address entered"});
	data = {"id":resp,"enode":req.body.enode,"address":req.body.address};
	transferEthers(data.address);
	updateActivePeers(data);
	res.json({"status":"complete"});
});

app.get('/api/getActivePeers', function(req,res){
	result = updateActivePeers();
	res.json(activePeers);
});


app.get('/api/getAllPeers', function(req,res){
	res.json(getAllPeers());
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

function getAllPeers(){
	peers = web3.admin.peers;
	console.log("Peers" + peers);
	
	if(peers.length == 0)
		return -1;
	else
	{	
		peerList = [];
		for(i=0; i<peers.length; i++){
			peerList.push(peers[i].id);
		}
		return peerList;
	}
}

function checkValidEnode(enode){
	peers = getAllPeers();
	temp = enode.split("enode://")
	if(temp.length<2)
		return -1;
	address = temp[1].split("@")
	index =  peers.indexOf(address[0]);
	if(index == -1)
		return -1;
	if(address[1].split(":]:").length>1)
		return 0;
	return address[0];
}

function transferEthers(receiver){
	console.log(receiver)
	if(sentPeers[receiver] == null)
		transactionObject = {from:web3.eth.coinbase, to:receiver, value:500000}
		web3.personal.unlockAccount(web3.eth.coinbase, "PASSWORD HERE", function(){
			web3.eth.sendTransaction(transactionObject, function(data){
				sentPeers[receiver] = 1
			});	
		})
		
	//console.log(sentPeers)
}

function updateActivePeers(data){
	data = data || null;
	peers = getAllPeers();
	if(data!=null)
	{
		console.log("Current list:",activePeers);
		var fresh = 1;
		for(i=0; i<activePeers.length; i++)
			if(activePeers[i].id == data.id)
			{
				fresh=0;
				break;
			}

		if(fresh == 1)
			activePeers.push(data)
	}
	//Updating current list
	if(peers== -1){
		activePeers = [];
		return -1;
	}
	for(i=0; i<activePeers.length; i++){
		if(peers.indexOf(activePeers[i].id) == -1){
			activePeers.splice(i,1);
		}
	}
	return 1;
}