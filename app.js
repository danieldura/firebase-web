$(document).ready(function(){
	var rootRef = new Firebase('https://ddura-jugadores.firebaseio.com/');
	rootRef.on("value", function(snapshot){
		// console.log(snapshot.val())
		var data = snapshot.val();

		$("#playersTable tbody").empty();

		var row = "";

		for (player in snapshot.val()){
			//console.log(player, ',',data[player]);

			row += "<tr>"+
					"<td class=\"playerName\">" + player + "</td>" +
					"<td>" + data[player].mail + "</td>" +
					"<td>" + data[player].number + "</td>" +
					"<td>" + data[player].position + "</td>" +
					"<td> <div class=\"btnDelete btn btn-danger glyphicon glyphicon-remove\"></div></td>" +
				"</tr>"
		}
		$("#playersTable tbody").append(row);

		row="";
// ##################################################	
// ###########  Delete record from firebase #########
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

		$(".btnDelete").click(function(){
			console.log('clicked')
			var selectedPlayer = $(this).closest("tr")
				.find(".playerName")
				.text();

			console.log(selectedPlayer);
			rootRef.child(selectedPlayer).remove();
		})



	}, function(errorObject){
		console.log("The read failed: " + errorObject.code);
	});
// ##################################################	
// ###########  Sending data to firebase ############
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    $("#btnSend").click(function() {
        var fullName = $("#fullName").val();

        var dataPlayer = {
            name: fullName,
            mail: $("#mail").val(),
            number: $("#number").val(),
            position: $("#position option:selected").text()
        }

        var onComplete = function(error){
        	if (error){
        		console.log(error,'La sincronización falló');
        	}else{
        		console.log(error,'La sincronización ha sido exitosa');
        	}
        }

        rootRef.once('value', function(snapshot){
            if(snapshot.hasChild(fullName)){
                $('#myModal').modal('show');
            } else {
                rootRef.child(fullName).set(dataPlayer, onComplete);
            }

        })


       

    })
});