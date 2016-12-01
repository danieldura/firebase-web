$(document).ready(function(){

	$("#btnLogout").hide();
	$(".authUserData").hide();
	


	// var rootRef = new Firebase('https://ddura-jugadores.firebaseio.com/');
	var file, fileName, fileRef, storageImagesRef, storageRef, uploadTask, downloadURL;
	var storageFolder="/img/"
	var database = firebase.database();
	var oauth = firebase.auth();
	var provider = new firebase.auth.FacebookAuthProvider();
	var rootRef = database.ref();

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
					"<td class\"image\"><img class=\"img-responsive img-circle\" src=\""+ data[player].image +"\" alt=\"" + player + "\"></td>  " +
					"<td class=\"btnsEdit hidden\"> <div class=\"btnEdit btn btn-warning glyphicon glyphicon-edit\"></div> </td>" +
					"<td class=\"btnsEdit hidden\"> <div class=\"btnDelete btn btn-danger glyphicon glyphicon-remove\"></div></td>" +
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
			$("#btnSend").text("Actualizar").removeClass("disabled").removeClass("btn-primary").addClass("btn-warning").unbind("click").click(function(){
				rootRef.child(selectedPlayer).update({
					mail: $("#mail").val(),
					number: $("#number").val(),
					position: $("#position option:selected").text()
				},function(){
					$("#fullName").val("");
					$("#mail").val("");
					$("#number").val("");
					$("#position").val("");
					$("#btnSend").text("Enviar").removeClass("btn-warning").addClass("btn-primary").unbçind("click");
				})

			});

		});

		// $("#btnSend").click(sendData);


		}, function(errorObject){
				console.log("The read failed: " + errorObject.code);
		});
	}

//#################### END getData ##################
//*****************************************************
	$("#btnUpload").change(function(){
		file 		= document.getElementById("btnUpload").files[0];
		fileName 	= file.name;
		storageRef 	= firebase.storage().ref(storageFolder + fileName);
		uploadTask 	= storageRef.put(file);

		uploadTask.on('state_changed', function(snapshot){


		}, function(error){
			console.log("Error uploadTask " + error)
		}, function(){
			downloadURL = uploadTask.snapshot.downloadURL;
			console.log("URL de la imagen:"+downloadURL);
			$("#btnUpload").addClass("btn-success");
			$("#btnSend").removeClass("disabled").click(sendData);
		});
	})

	$("#btnLogin").click(function(){
		$("#btnLogin").toggle();
		$("#btnLogout").toggle();
		login();

	})

	$("#btnLogout").click(function(){
		$("#btnLogin").toggle();
		$("#btnLogout").toggle();
		clearDataLabels();
		oauth.signOut();
		$("#playersTable tbody").empty();
		$(".usrPhoto").empty();
		$("#myModalNoSession").modal("show");
	})

	var setDataLabels = function(user){
		console.log(user);
		if (user != null) {
	  		user.providerData.forEach(function(profile){
				$(".authUser").html('<div class="usrPhoto"></div>Bienvenido <label id="authUser"></label> has iniciado sesión con <label id="authProvider"></label>');
				$("#authUser").text(profile.displayName);
				$(".usrPhoto").css('background-image','url(' + profile.photoURL + ')');
				$("#authProvider").text(profile.providerId);
				$(".authUserData").toggle();
			})
  		}
	}

	var clearDataLabels = function(authData){
		$("#authUser").text("");
		$(".usrPhoto").css('background-image','none');
		$("#authProvider").text("");
		$(".authUserData").toggle();
	}

	var authData = firebase.auth().onAuthStateChanged(function(user) {
	  	if (user) {

			console.log("Usuario "+ user.uid + " logueado con " + user.provider);
			$("#btnLogin").toggle();
			$("#btnLogout").toggle();
			getData();
			setDataLabels(user);
		}else{
			console.log("El usuario ha cerrado sesión");

		}
	});

	var login = function(){
		oauth.signInWithPopup(provider).then(function(authData){
			getData();
			setDataLabels(authData.user);
		}).catch(function(error){
			console.log("El login falló ", error);
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
	        	position: $("#position option:selected").text(),
	        	image : downloadURL
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
