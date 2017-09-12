$(document).ready(function(){
	$("#formSubmit").click(function(){
		var add = $("#address").val();
		var enode = $("#enode").val();
		if(add.length == 0 || enode.length == 0){
			alert("Please enter both Address and enode values");
		}
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
					console.log(d);
				});
			}
		});
	})

});