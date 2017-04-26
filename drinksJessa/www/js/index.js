var app = {

	model: {
		'clients':{}
	},

	modelMeet: {
		'hoy':{}
	},

	firebaseConfig: {
	    apiKey: "AIzaSyC50skbZWPdmbhMgSz9ulM8pBJ8r8F8lag",
	    authDomain: "drinksmenu-ab56b.firebaseapp.com",
	    databaseURL: "https://drinksmenu-ab56b.firebaseio.com",
	    projectId: "drinksmenu-ab56b",
	    storageBucket: "drinksmenu-ab56b.appspot.com",
	    messagingSenderId: "495209622347"
  	},

  	setSnap: function(snap){
  		app.model = snap;
  		app.refreshData();
  		app.loadClients();
  	},

	addUser: function(data){
		var dato = data.id
		var args = dato.split("_");
		$('#invited').attr('value',args[1]);
		$('.ocult').attr('id',args[0]);
	},

	addClient: function(){
		var aux = 0;
		var aux2 = 0;
		var user = document.getElementById('invited').value;
		var client = document.getElementsByClassName('ocult')[0].id;
		if(user){
			for(var key in app.modelMeet.hoy) {
				if (key === client) {
					for(var key2 in app.modelMeet.hoy[client]){
						if (key2 === user) {
							alert('Ya se agregó esta persona a la reunión');
							aux = 1;
							break;
						}
					}
					if (!aux) {
						app.modelMeet.hoy[client][user] = 'Nombre';
						aux2 = 1;
						break;
					}
				}
			}
			if (!aux2) {
				app.modelMeet.hoy[client] = {};
				app.modelMeet.hoy[client][user] = 'Nombre';
			}
			app.refreshMeeting();
		}
	},

	delUser: function(){
		app.model.pop();
		app.refreshModal();
	},

	refreshMeeting: function(){;
		var users = $('#info-meet');
		users.html('');
		var codigo = '';
		codigo += '<label>Invitados para la reunión:</label>';
		for(var key in app.modelMeet.hoy){
				for(var key2 in app.modelMeet.hoy[key]){
			codigo += '<div class="input-group">';
				codigo += '<span class="input-group-addon"><img src="img/social.svg" height="20px"></span>';
				codigo += '<input type="text" class="form-control" value="'+key2+'" style="width: 80%;" id="" disabled="">';
				codigo += '<span id="ocult" style="display: none;" class='+key+'></span>';
			codigo += '</div><br>';
				}
		}
		codigo += '<div class="input-group">';
			codigo += '<span class="input-group-addon"><img src="img/social.svg" height="20px"></span>';
			codigo += '<input type="text" class="form-control" placeholder="Invitado" style="width: 80%;" data-toggle="modal" data-target="#myModal7" id="invited">';
			codigo += '<span class="ocult" style="display: none;"></span>';
		codigo += '</div><br>';
		codigo += '<div class="input-group">';
			codigo += '<span style="margin-left: 30%;" onclick="app.addClient();"><img src="img/social3.svg" height="30px"></span>';
		codigo += '</div><br>';
		users.append(codigo);
		console.log(JSON.stringify(app.modelMeet.hoy));
		app.refreshMeetingModal();		
	},

	refreshMeetingModal: function(){
		var users = $('#user-body');
		users.html('');
		var codigo = '<table class="table table-bordered"';
				codigo += '<tbody>';
					codigo += '<tr>';
						codigo += '<th>Empresa</th>';
						codigo += '<th>Nombre</th>';
					codigo += '</tr>';
				for (var key in app.modelMeet.hoy) {
					for(var key2 in app.modelMeet.hoy[key]){
						codigo += '<tr>';
							codigo += '<td>'+key+'</td>'
							codigo += '<td>'+key2+'</td>';
						codigo += '</tr>';
                	}
				}
				codigo += '</tbody>';
			codigo += '</table>';
		users.append(codigo);
	},

	refreshData: function(){
		var users = $('#menu-options');
		var clients = $('#menu-clients');
		users.html('');
		clients.html('');
		var codigo = '';
		codigo += '<ul class="nav nav-list">';
		for(var key in app.model.clients){
			codigo += '<li>';
				codigo += '<label class="tree-toggle nav-header">'+key+'</label>';
				codigo += '<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>';
				codigo += '<ul class="nav nav-list tree">';
				for(var key2 in app.model.clients[key]){
					codigo += '<li id="'+key+'_'+key2+'" data-dismiss="modal" onclick="app.addUser(this);">&nbsp;&nbsp;&nbsp;<i class="fa fa-circle-o"></i>&nbsp;'+key2+'</li>';
				}
				codigo += '</ul>';
			codigo += '</li>';
		}
		codigo += '</ul>';
		users.append(codigo);
		clients.append(codigo);
		$('.tree-toggle').click(function () {
			$(this).parent().children('ul.tree').toggle(200);
		});
		$('.tree-toggle').parent().children('ul.tree').toggle(200);
	},

    saveName: function(){
    	var client = document.getElementById('name-clients').value;
        var name = document.getElementById('name-client').value;
        var aux = 0;
        for(var key in app.model.clients){
            if (key === client) {
                for(var key2 in app.model.clients[client]){
                	if (key2 === name){
                		alert('Esta persona ya está registrada');
                		aux = 1;
                	}
                }
            }
        }
        if (!aux) {
        	app.saveFirebase(client,name);
        }
        document.getElementById('name-clients').value = '';
        document.getElementById('name-client').value = '';
    },

	saveFirebase: function(client,name){
		var aux = 0;
		for(var key in app.model.clients){
			if (key === client) {
				firebase.database().ref('clients').child(key).child(name).update({Bebida:'',Coment:''});
				aux = 1;
				break;
			}
		}
		if (!aux) {
			firebase.database().ref('clients').child(client).child(name).update({Bebida:'',Coment:''});
		}
	},

	sendMeet: function(){
		try{
			firebase.database().ref('hoy').remove();
		}
		catch(err){}
		firebase.database().ref().update(app.modelMeet);
	},

	refreshClient: function(dat){
        if (!dat.id) {
            document.getElementById('name-clients').placeholder = "No ha seleccionado el cliente";
        }
        else{
            document.getElementById('name-clients').value = dat.id;
        }
	},

	loadClients: function(opt){
		var users = $('#clients');
		users.html('');
		for (var key in app.model.clients) {
			var codigo = '';
			codigo += '<div class="radio" onclick="app.refreshClient(this);" id="'+key+'" data-dismiss="modal">';
				codigo += '<label>';
					codigo += '<input type="radio" value="'+key+'">&nbsp;&nbsp;';
					codigo += key;
				codigo += '</label>';
			codigo += '</div>';
			codigo += '<br>';
			users.append(codigo);
		}
	},

}

firebase.initializeApp(app.firebaseConfig);
firebase.database().ref().on('value', function(snap){
	if (snap.val() !== null) {
		app.setSnap(snap.val());
	}
});