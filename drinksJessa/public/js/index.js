var app = {

	model: {
	},

	modelMeet: {
		'titulo': '',
		'fecha': '',
		'users':[]
	},

	modelMeetings: {
		'meetings':{}
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
  		app.modelMeetings.meetings = snap.meetings;
  		app.refreshData();
  		app.loadClients();
  		app.refreshMeets();
  	},

	addUser: function(data){
		var dato = data.id
		var args = dato.split("_");
		$('#invited').attr('value',args[1]);
		$('.ocult').attr('id',args[0]);
	},

	addClient: function(){
		var aux = 0;
		var user = document.getElementById('invited').value;
		var client = document.getElementsByClassName('ocult')[0].id;
		if(user){
			for(var i=0; i<app.modelMeet['users'].length; i++) {
				if(app.modelMeet['users'][i]['Nombre'] === user && app.modelMeet['users'][i]['Cliente'] === client){
					alert('Ya se agregó esta persona a la reunión');
					aux = 1;
					break;
				}
			}
			if (!aux) {
				app.modelMeet['users'].push({'Nombre':user,'Cliente':client});
			}
			app.refreshMeeting();
			app.refreshMeetingModal();
		}
	},

	delMeet: function(){
		var users = $('#info-meet');
		users.html('');
		var codigo = '';
		codigo += '<label>Invitados para la reunión:</label>';
		codigo += '<div class="input-group">';
			codigo += '<span class="input-group-addon"><img src="img/social.svg" height="20px"></span>';
			codigo += '<input type="text" class="form-control" placeholder="Invitado" style="width: 80%;" data-toggle="modal" data-target="#myModal7" id="invited">';
			codigo += '<span class="ocult" style="display: none;"></span>';
		codigo += '</div><br>';
		codigo += '<div class="input-group">';
			codigo += '<img src="img/social3.svg" height="30px" onclick="app.addClient();">';
		codigo += '</div><br>';
		users.append(codigo);
		app.modelMeet['users'] = [];
		app.refreshMeetingModal();
	},

	viewUser: function(data){
		var users = $('#mydata');
		var client = data.id.split('_')[0];
		var user = data.id.split('_')[1]; 
		users.html('');
		var codigo = '<table class="table table-bordered" id="guests2">';
				codigo += '<tbody>';
					codigo += '<tr>';
						codigo += '<th>Bebidas</th>';
						codigo += '<th>Comentarios</th>';
					codigo += '</tr>';
				for (var key in app.model.clients) {
					if (client === key) {
						for(var key2 in app.model.clients[key]){
							if (user === key2) {
								document.getElementById('myModalLabel4').innerHTML = 'Histórico de '+user;
								for(var i=0; i<app.model.clients[key][key2]['Bebida'].length; i++){
									console.log(app.model.clients[key][key2]['Bebida']);
									codigo += '<tr>';
										codigo += '<td>'+app.model.clients[key][key2]['Bebida'][i]+'</td>'
										codigo += '<td>'+app.model.clients[key][key2]['Coment'][i]+'</td>';
									codigo += '</tr>';
								}
								break;	
							}
	                	}
                	}
				}
				codigo += '</tbody>';
			codigo += '</table>';
		users.append(codigo);
	},

	delUser: function(){
		var datos = document.getElementsByClassName('confirm')[0].id;
		var key = datos.split('_')[0];
		var key2 = datos.split('_')[1];
		var index = -1;
		for(var i=0; i<app.modelMeet['users'].length; i++){
			if (app.modelMeet['users'][i]['Nombre'] === key2 && app.modelMeet['users'][i]['Cliente'] === key) {
				index = i;
				break;
			}
		}
		app.modelMeet['users'].splice(index,1);
		app.refreshMeeting();
		app.refreshMeetingModal();
	},

	delMeeting: function(){
		var datos = document.getElementsByClassName('confirmmeet')[0].id;
		firebase.database().ref('meetings').child(datos).remove();
		app.refreshMeets();
	},

	refreshMeeting: function(){;
		var users = $('#info-meet');
		users.html('');
		var codigo = '';
		codigo += '<label>Invitados para la reunión:</label>';
		for(var i=0; i<app.modelMeet['users'].length; i++){
			codigo += '<div class="input-group">';
				codigo += '<span class="input-group-addon"><img src="img/social.svg" height="20px"></span>';
				codigo += '<input type="text" class="form-control" value="'+app.modelMeet['users'][i]['Nombre']+'" style="width: 80%;" id="" disabled="">';
				codigo += '<span id="ocult" style="display: none;" class='+app.modelMeet['users'][i]['Cliente']+'></span>';
			codigo += '</div><br>';
		}
		codigo += '<div class="input-group">';
			codigo += '<span class="input-group-addon"><img src="img/social.svg" height="20px"></span>';
			codigo += '<input type="text" class="form-control" placeholder="Invitado" style="width: 80%;" data-toggle="modal" data-target="#myModal7" id="invited">';
			codigo += '<span class="ocult" style="display: none;"></span>';
		codigo += '</div><br>';
		codigo += '<div class="input-group">';
			codigo += '<img src="img/social3.svg" height="30px" onclick="app.addClient();">&nbsp;&nbsp;&nbsp;';
			codigo += '<img src="img/social4.svg" height="30px" onclick="app.delMeet();">&nbsp;&nbsp;&nbsp;';
			codigo += '<img src="img/arrows2.svg" height="25px" data-toggle="modal" data-target="#myModal">';
		codigo += '</div><br>';
		users.append(codigo);	
	},

	idConfirm: function(data){
		document.getElementsByClassName('confirm')[0].id = data.id;
	},

	confirmmeet: function(datakey){
		document.getElementsByClassName('confirmmeet')[0].id = datakey;
	},

	refreshMeetingModal: function(){
		var users = $('#user-body');
		users.html('');
		var codigo = '<table class="table table-bordered" id="guests">';
				codigo += '<tbody>';
					codigo += '<tr>';
						codigo += '<th>Empresa</th>';
						codigo += '<th>Nombre</th>';
					codigo += '</tr>';
				for (var i=0; i<app.modelMeet['users'].length; i++) {
					codigo += '<tr onclick="app.idConfirm('+app.modelMeet['users'][i]['Cliente']+'_'+app.modelMeet['users'][i]['Nombre']+');" data-toggle="modal" data-target="#myModal3">';
						codigo += '<td>'+app.modelMeet['users'][i]['Cliente']+'</td>';
						codigo += '<td>'+app.modelMeet['users'][i]['Nombre']+'</td>';
					codigo += '</tr>';
				}
				codigo += '</tbody>';
			codigo += '</table>';
		users.append(codigo);
		if (!app.modelMeet['users'][0]) {
			app.delMeet();
		}
	},

	refreshMeets: function(){
		var users = $('#mymeets');
		users.html('');
		var codigo = '<table class="table table-bordered" id="guests3">';
				codigo += '<tbody>';
					codigo += '<tr>';
						codigo += '<th>Título</th>';
						codigo += '<th>Fecha</th>';
					codigo += '</tr>';
				for (var key in app.modelMeetings.meetings) {
					codigo += '<tr onclick="app.confirmmeet('+"'"+key+"'"+');" data-toggle="modal" data-target="#myModal6">';
						codigo += '<td>'+app.modelMeetings.meetings[key]['titulo']+'</td>';
						codigo += '<td>'+app.modelMeetings.meetings[key]['fecha']+'</td>';
					codigo += '</tr>';
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
		var codigo2 = '';
		codigo += '<ul class="nav nav-list">';
		codigo2 += '<ul class="nav nav-list">';
		for(var key in app.model.clients){
			codigo += '<li>';
			codigo2 += '<li>';
				codigo += '<label class="tree-toggle nav-header">'+key+'</label>';
				codigo2 += '<label class="tree-toggle nav-header">'+key+'</label>';
				codigo += '<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>';
				codigo2 += '<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>';
				codigo += '<ul class="nav nav-list tree">';
				codigo2 += '<ul class="nav nav-list tree">';
				for(var key2 in app.model.clients[key]){
					codigo += '<li id="'+key+'_'+key2+'" data-dismiss="modal" onclick="app.addUser(this);">&nbsp;&nbsp;&nbsp;<i class="fa fa-circle-o"></i>&nbsp;'+key2+'</li>';
					codigo2 += '<li id="'+key+'_'+key2+'" data-toggle="modal" data-target="#myModal4" onclick="app.viewUser(this);">&nbsp;&nbsp;&nbsp;<i class="fa fa-circle-o"></i>&nbsp;'+key2+'</li>';
				}
				codigo += '</ul>';
				codigo2 += '</ul>';
			codigo += '</li>';
			codigo2 += '</li>';
		}
		codigo += '</ul>';
		codigo2 += '</ul>';
		users.append(codigo2);
		clients.append(codigo);
		$('.tree-toggle').click(function () {
			$(this).parent().children('ul.tree').toggle(200);
		});
		$('.tree-toggle').parent().children('ul.tree').toggle(200);
	},

    saveName: function(){
    	var client = document.getElementById('name-clients').value;
        var name = document.getElementById('name-client').value;
        var email = document.getElementById('email-client').value;
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
        	app.saveFirebase(client,name,email);
        }
        document.getElementById('name-clients').value = '';
        document.getElementById('name-client').value = '';
        document.getElementById('email-client').value = '';
    },

	saveFirebase: function(client,name,email){
		var aux = 0;
		for(var key in app.model.clients){
			if (key === client) {
				firebase.database().ref('clients').child(key).child(name).update({Bebida:[''],Coment:[''],Email:email});
				aux = 1;
				break;
			}
		}
		if (!aux) {
			firebase.database().ref('clients').child(client).child(name).update({Bebida:[''],Coment:[''],Email:email});
		}
	},

	sendMeet: function(){
		app.modelMeet['titulo'] = document.getElementById('title-meet').value;
		app.modelMeet['fecha'] = $('#datepicker').datepicker('getDate').toDateString();
		firebase.database().ref('meetings').push(app.modelMeet);
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

$('#datepicker').datepicker({
              autoclose: true,
              todayHighlight: true
            });