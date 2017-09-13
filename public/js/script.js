/*
	The script file to interact with the Node.js backend and interact with the user
	Author: Aneesh Bhatnagar
	URL: www.aneeshbhatnagar.com
*/

$(document).ready(function(){

	$.ajax({
		url:'/api/getActivePeers',
		type: 'GET'
	}).done(function(data){
		createTable(data)
	});

	$("#formSubmit").click(function(){
		var add = $("#address").val();
		var enode = $("#enode").val();
		if(add.length == 0 || enode.length == 0){
			alert("Please enter both Address and enode values");
			return;
		}
		$("#enode").val("");
		$("#address").val("");
		$.ajax({
		    url: '/api/newNode', 
		    type: 'POST', 
		    contentType: 'application/json', 
		    data: JSON.stringify({"address":add,"enode":enode})}
		).done(function(resp){
			if(resp.status == "error"){
				alert(resp.errorDetails);
			}else if(resp.status == "complete"){
				console.log("Complete");
				$.ajax({
					url: 'http://localhost:8080/api/getActivePeers', 
				    type: 'GET'
				}).done(function(d){
					createTable(d);
				});
			}
		});
	})

});


function createTable(data){
	opString = '<tr><th style="width:35%;">Address</th><th style="width:65%;">enode</th></tr>';
	for(i=0; i<data.length; i++){
		opString+='<tr><td style="word-wrap: break-word">'+data[i].address+'</td><td style="word-wrap: break-word">'+data[i].enode+'</td></tr>';
	}
	$("#active-peers").html(opString);
}