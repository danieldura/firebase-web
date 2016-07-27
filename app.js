var rootRef = new Firebase('https://ddura-jugadores.firebaseio.com/');
rootRef.on("value", function(snapshot){
	console.log(snapshot.val())
	var data = snapshot.val();

	$("#playersTable tbody").empty();

	var row = "";

	for (player in snapshot.val()){
		console.log(player, ',',data[player]);

		row += "<tr>"+
				"<td>" + player + "</td>" +
				"<td>" + data[player].mail + "</td>" +
				"<td>" + data[player].number + "</td>" +
				"<td>" + data[player].position + "</td>" +
			"<tr>"
	}
	$("#playersTable tbody").append(row);
}, function(errorObject){
	console.log("The read failed: " + errorObject.code);
});