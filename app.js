$(document).ready(function(){

	$("#btnLogout").hide();
	$(".authUserData").hide();
	$("#btnSend").click(sendData);

	var rootRef = new Firebase('https://ddura-jugadores.firebaseio.com/');
	
	var getData = function() {		

		rootRef.on("value", function(snapshot){
		// console.log(snapshot.val())
		var data = snapshot.val();

		$("#playersTable tbody").empty();

		var row = "";

		for (player in snapshot.val()){
			//console.log(player, ',',data[player]);

			row += "<tr>"+
					"<td class=\"playerName\">" + player + "</td>" +
					"<td class=\"mail\">" + data[player].mail + "</td>" +
					"<td class=\"number\">" + data[player].number + "</td>" +
					"<td class=\"position\">" + data[player].position + "</td>" +
					"<td> <div class=\"btnEdit btn btn-warning glyphicon glyphicon-edit\"></div> </td>" +
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


// ##################################################	
// ###########  Edit record from firebase ###########
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
		$(".btnEdit").click(function(){
			//console.log('Button edit clicked');
			var selectedPlayer = $(this).closest("tr")
			.find(".playerName")
			.text();

			$("#fullName").val($(this).closest("tr").find(".playerName").text());
			$("#mail").val($(this).closest("tr").find(".mail").text());
			$("#number").val($(this).closest("tr").find(".number").text());
			$("#position").val($(this).closest("tr").find(".position").text());
			$("#btnSend").text("Actualizar").removeClass("btn-primary").addClass("btn-warning").unbind("click").click(function(){
				rootRef.child(selectedPlayer).update({
					mail: $("#mail").val(),
					number: $("#number").val(),
					position: $("#position option:selected").text()				
				},function(){
					$("#fullName").val("");
					$("#mail").val("");
					$("#number").val("");
					$("#position").val("");
					$("#btnSend").text("Enviar").removeClass("btn-warning").addClass("btn-primary").unbind("click").click(sendData);
				})

			});

		})

		$("#btnSend").click(sendData);


		}, function(errorObject){
				console.log("The read failed: " + errorObject.code);
		});
	}

	$("#btnLogin").click(function(){
		$("#btnLogin").toggle();
		$("#btnLogout").toggle();
		login();

	})

	$("#btnLogout").click(function(){
		$("#btnLogin").toggle();
		$("#btnLogout").toggle();
		clearDataLabels();
		rootRef.unauth();
		$("#playersTable tbody").empty();
		$("#myModalNoSession").modal("show");
	})

	var setDataLabels = function(authData){
		console.log(authData);
		$(".authUser").html('<div class="usrPhoto"></div>Bienvenido <label id="authUser"></label> has iniciado sesión con <label id="authProvider"></label>');
		$("#authUser").text(authData[authData.provider].displayName);
		$(".usrPhoto").css('background-image','url(' + authData[authData.provider].profileImageURL + ')');
		$("#authProvider").text(authData.provider);
		$(".authUserData").toggle();
	}

	var clearDataLabels = function(authData){
		$("#authUser").text("");
		$(".usrPhoto").css('background-image','none');
		$("#authProvider").text("");
		$(".authUserData").toggle();
	}

	var authData = rootRef.getAuth();
	if(authData){
		console.log("Usuario "+ authData.uid + " logueado con " + authData.provider);
		$("#btnLogin").toggle();
		$("#btnLogout").toggle();
		getData();
		setDataLabels(authData);
	}else{
		console.log("El usuario ha cerrado sesión");

	}



	var login = function(){
		rootRef.authWithOAuthPopup("facebook", function(error, authData){
			if(error){
				console.log("El login falló ", error);
			}else{
				console.log("El login se realizó correctamente", authData);
				getData();
				setDataLabels(authData);
			}
		})
	}

	// ##################################################	
	// ###########  Sending data to firebase ############
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	function sendData() {
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

	}
});