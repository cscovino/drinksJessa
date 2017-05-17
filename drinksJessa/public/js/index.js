var app = {

	model: {
	},

	modelMeet: {
		'titulo': '',
		'fecha': '',
		'users':[]
	},

	weekday: ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'],

	monthyear: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],

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
  		app.refreshMeets();

  		var date = new Date();
		var d = date.getDate(),
		    m = date.getMonth(),
		    y = date.getFullYear();
		$('#calendar').fullCalendar({
		  header: {
		    left: 'prev,next today',
		    center: 'title',
		    right: 'month,agendaWeek,agendaDay'
		  },
		  buttonText: {
		    today: 'today',
		    month: 'month',
		    week: 'week',
		    day: 'day'
		  },
		  editable: false,
		  draggable: false,
		  eventClick: function(calEvent,jsEvent,view){
				app.editMeet(calEvent);
			},
		});

		app.refreshCalendar();
  	},

  	editMeet: function(calEvent){
  		app.modelMeet = {};
  		document.getElementById('title-meet').value = calEvent.title;
  		var fecha = calEvent.start['_i'].toDateString().split(' ');
  		var test = calEvent.start['_i'].toString().split(' ')[4].split(':');
  		var amopm = 'AM';
  		var amopm2 = 'AM';
  		var hora,hora3,hora4;
  		var tim = +test[0]+1;
  		if (test[0] > 12) {
  			var aux = test[0]-12;
  			hora4 = aux+':'+test[1];
  			if (aux < 10) {
  				aux = '0'+aux;
  			}
  			hora = aux+':'+test[1];
  			amopm = 'PM';
  		}
  		else{
  			hora = test[0]+':'+test[1];
  			hora4 = hora;
  		}
  		if (tim > 12) {
  			var aux = tim-12;
  			if (aux < 10) {
  				aux = '0'+aux;
  			}
  			hora3 = aux+':'+test[1];
  			amopm2 = 'PM';
  		}
  		else{
  			hora3 = tim+':'+test[1];
  		}
  		var m = app.monthyear.indexOf(fecha[1])+1;
  		var d = fecha[2];
  		if (m < 10) {
  			m = '0'+m;
  		}
  		if (d < 10) {
  			d = '0'+d;
  		}
  		var upd = m+'-'+d+'-'+fecha[3];
  		$('#datepicker').datepicker('update', upd);
  		$('#timepicker').timepicker('setTime', hora+' '+amopm);
  		$('#timepicker2').timepicker('setTime', hora3+' '+amopm2);
  		upd = upd.replace(/-/g,'/');
  		for(var key in app.model.meetings){
  			if (app.model.meetings[key]['titulo']===calEvent.title) {
  				if (app.model.meetings[key]['fecha'].split(' ')[0] === upd) {
  					var h1 = app.model.meetings[key]['fecha'].split(' ');
  					var hora1 = h1[1]+' '+h1[2];
  					var hora2 = hora4+' '+amopm;
  					if (hora1 === hora2) {
  						app.modelMeet = app.model.meetings[key];
  						app.refreshMeeting();
  						app.refreshMeetingModal();
  						break;
  					}
  				}
  			}
  		}
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
		document.getElementById('title-meet').value = '';
		var users = $('#info-meet-data');
		users.html('');
		var codigo = '';
		codigo += '<label>Invitados para la reunión:</label>';
		codigo += '<div class="input-group">';
			codigo += '<span class="input-group-addon"><img src="img/social.svg" height="20px"></span>';
			codigo += '<input type="text" class="form-control" placeholder="Invitado" style="width: 80%;" data-toggle="modal" data-target="#myModal7" id="invited">';
			codigo += '<span class="ocult" style="display: none;"></span>';
		codigo += '</div><br>';
		document.getElementById('guardar-button').disabled = true;
		document.getElementById('borrar-button').disabled = true;
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
		var users = $('#info-meet-data');
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
		if (app.modelMeet['users'].length > 0) {
			document.getElementById('guardar-button').disabled = false;
			document.getElementById('borrar-button').disabled = false;
		}
		codigo += '<div class="input-group">';
			codigo += '<span class="input-group-addon"><img src="img/social.svg" height="20px"></span>';
			codigo += '<input type="text" class="form-control" placeholder="Invitado" style="width: 80%;" data-toggle="modal" data-target="#myModal7" id="invited">';
			codigo += '<span class="ocult" style="display: none;"></span>';
		codigo += '</div><br>';
		users.append(codigo);	
	},

	idConfirm: function(data){
		document.getElementsByClassName('confirm')[0].id = data.id;
	},

	confirmeet: function(datakey){
		document.getElementsByClassName('confirmmeet')[0].id = datakey;
	},

	refreshMeetingModal: function(){
		var users = $('#user-body');
		users.html('');
		var codigo = '<div id="" class="confirmmeet">¿Deseas programar esta reunión?</div><br>';
			codigo += '<table class="table table-bordered" id="guests">';
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
		var today = new Date();
		users.html('');
		var codigo = '';
		var codigo = '<table class="table table-bordered" id="guests3">';
				codigo += '<tbody>';
					codigo += '<tr>';
						codigo += '<th>Fecha</th>';
						codigo += '<th>Hora</th>';
						codigo += '<th>Título</th>';
					codigo += '</tr>';
				for (var key in app.model.meetings) {
					codigo += '<tr onclick="app.confirmeet('+"'"+key+"'"+');" data-target="#myModal6" data-toggle="modal">';
						var dd = app.model.meetings[key]['fecha'].split(' ');
						var datee = dd[0].split('/');
						var dait = new Date(datee[2],datee[0]-1,datee[1]);
						var today = new Date();
						if (dait.toDateString() === today.toDateString()) {
							codigo += '<td>Hoy</td>';
						}
						else{
							codigo += '<td>'+app.weekday[dait.getDay()]+' '+dait.getDate()+' '+app.monthyear[dait.getMonth()]+'</td>';
						}
						codigo += '<td>'+dd[1]+' '+dd[2]+' - '+dd[4]+' '+dd[5]+'</td>';
						codigo += '<td>'+app.model.meetings[key]['titulo']+'</td>';
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
		app.modelMeet['fecha'] = document.getElementById('datepicker').value;
		app.modelMeet['fecha'] += ' '+document.getElementById('timepicker').value+' - ';
		app.modelMeet['fecha'] += document.getElementById('timepicker2').value;
		for(var key in app.model.meetings){
  			if (app.model.meetings[key]['titulo']===app.modelMeet['titulo']) {
  				if (app.model.meetings[key]['fecha'].split(' ')[0]===document.getElementById('datepicker').value) {
  					var h1 = app.model.meetings[key]['fecha'].split(' ');
  					var h2 = app.modelMeet['fecha'].split(' ');
  					var hora1 = h1[1]+' '+h1[2];
  					var hora2 = h2[1]+' '+h2[2];
  					if (hora1 === hora2) {
  						firebase.database().ref('meetings').child(key).remove();
  						break;
  					}
  				}
  			}
  		}
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
		var codigo = '';
		for (var key in app.model.clients) {
			codigo += '<div class="radio" onclick="app.refreshClient(this);" id="'+key+'" data-dismiss="modal">';
				codigo += '<label>';
					codigo += '<input type="radio" value="'+key+'">&nbsp;&nbsp;';
					codigo += key;
				codigo += '</label>';
			codigo += '</div>';
		}
		codigo += '<br>';
		users.append(codigo);
	},

	refreshCalendar: function(){
		$('#calendar').fullCalendar('removeEvents');
		for(var key in app.model.meetings){
			var dateVar = app.model.meetings[key]['fecha'].split(' ');
			var yearVar = dateVar[0].split("/")[2];
			var monthVar = dateVar[0].split("/")[0];
			var dayVar = dateVar[0].split("/")[1];
			var yearVarE = dateVar[4].split("/")[2];
			var monthVarE = dateVar[4].split("/")[0];
			var dayVarE = dateVar[4].split("/")[1];
			var hVar = dateVar[1].split(':')[0];
			if (dateVar[2] === 'PM') {
				hVar = +hVar + 12;
				if (hVar === 24) {
					hVar = 00;
				}
			}
			var mVar = dateVar[1].split(':')[1];
			var hVarE = dateVar[5].split(':')[0];
			if (dateVar[6] === 'PM') {
				hVarE = +hVarE + 12;
				if (hVarE === 24) {
					hVarE = 00;
				}
			}
			var mVarE = dateVar[5].split(':')[1];
			var ttE = app.model.meetings[key]['titulo'];
			var eventsE = {
				title: ttE,
				start: new Date(yearVar,monthVar-1,dayVar,hVar,mVar),
				end: new Date(yearVarE,monthVarE-1,dayVarE,hVarE,mVarE),
				allDay: false,
				backgroundColor: "#0073b7",
				borderColor :"#0073b7",
			};

			$('#calendar').fullCalendar('renderEvent', eventsE, 'stick');
			eventsE = '';
		}
		$('#calendar').fullCalendar({

		});
	},

}

$('#datepicker').datepicker({
  autoclose: true
});
$("#timepicker").timepicker({
  showInputs: false
});
$("#timepicker2").timepicker({
  showInputs: false
});

firebase.initializeApp(app.firebaseConfig);
firebase.database().ref().on('value', function(snap){
	if (snap.val() !== null) {
		app.setSnap(snap.val());
	}
});