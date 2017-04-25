var app = {

	model: {
		"clients": {},
	},

	model2:{},

	firebaseConfig: {
	    apiKey: "AIzaSyC50skbZWPdmbhMgSz9ulM8pBJ8r8F8lag",
	    authDomain: "drinksmenu-ab56b.firebaseapp.com",
	    databaseURL: "https://drinksmenu-ab56b.firebaseio.com",
	    projectId: "drinksmenu-ab56b",
	    storageBucket: "drinksmenu-ab56b.appspot.com",
	    messagingSenderId: "495209622347"
  	},

  	initFirebase: function(){
  		firebase.initializeApp(app.firebaseConfig);
        emailjs.init("user_E6w9y3AjySOWMQGes6bIy");

        //firebase.database().ref('clients').set({Avior:{Fabio:{Bebida:"Te"},Ronel:{Bebida:"Coca-Cola"}}});
        //firebase.database().ref('clients').child("Avior").child("Ronel").remove();
        firebase.database().ref().on('child_added', function(snap){
        	app.model2 = snap.val();
        	for(var key in app.model2){
        		for(var key2 in app.model2[key]){
        			console.log(app.model2[key][key2]);
        		}
        	}
        });
  	},

    gotData: function(data){
        console.log(data.val());
    },

    errData: function(err){
        console.log(err);
    },

	addUser: function(){
		var cc = document.getElementById('name-client').value;
		try {
			var data = document.getElementById('name-user').value;
		}
		catch(err){
			console.log(err);
		}
		if (data && cc) {
			app.model.clients[cc][data] = {};
            app.model.clients[cc][data]['Bebida'] = '';
            app.model.clients[cc][data]['Coment'] = '';
			app.refreshModal();
		}
		else if (cc) {
			app.model.clients[cc] = {};
			app.refreshModal();
		}
	},

	delUser: function(){
		app.model.pop();
		app.refreshModal();
	},

	refreshModal: function(){
		var users = $('#user-body');
		var cc = document.getElementById('name-client').value;
		users.html('');
		var codigo = '';
		codigo += '<div class="input-group">';
			codigo += '<span class="input-group-addon"><i class="fa fa-briefcase"></i></span>';
			codigo += '<input type="text" class="form-control" value="'+cc+'" id="name-client" disabled="">'
		codigo += '</div>';
		codigo += '<br>';
		for (var key in app.model.clients[cc]) {
			codigo += '<div class="input-group">';
				codigo += '<span class="input-group-addon"><i class="fa fa-user"></i></span>';
				codigo += '<input type="text" class="form-control" value="'+key+'" disabled="">';
			codigo += '</div>';
			codigo += '<br>';
		}
		codigo += '<div class="input-group">';
			codigo += '<span class="input-group-addon"><i class="fa fa-user"></i></span>';
			codigo += '<input type="text" class="form-control" placeholder="Nombre" id="name-user">'
		codigo += '</div>';
		users.append(codigo);
	},

	save: function(){
		var users = $('#user-body2');
		users.html('');
		var codigo = '<table class="table table-bordered"';
				codigo += '<tbody>';
					codigo += '<tr>';
						codigo += '<th>Empresa</th>';
						codigo += '<th>Nombre</th>';
						codigo += '<th>Bebida</th>';
                        codigo += '<th>Comentario</th>';
					codigo += '</tr>';
				for (var key in app.model.clients) {
						for(var key2 in app.model.clients[key]){
							codigo += '<tr>';
								codigo += '<td>'+key+'</td>'
								codigo += '<td>'+key2+'</td>';
								codigo += '<td>'+app.model.clients[key][key2]['Bebida']+'</td>';
		                        codigo += '<td>'+app.model.clients[key][key2]['Coment']+'</td>';
							codigo += '</tr>';
                    	}
				}
				codigo += '</tbody>';
			codigo += '</table>';
		users.append(codigo);
	},

    saveComments: function(){
		var cc = document.getElementById('client').innerHTML;
        var comment = document.getElementById('client-comment').value;
        var client = document.getElementById('client-name').innerHTML;
        for(var key in app.model.clients[cc]){
            if (key === client) {
                app.model.clients[cc][key]['Coment'] = comment;
                break;
            }
        }
        app.save();
        document.getElementById('client-comment').value = '';
        document.getElementById('client-name').innerHTML = 'Nombre';
        document.getElementById('client-drink').innerHTML = "Bebida";
        document.getElementById('client').innerHTML = "Empresa";
    },

	saveFirebase: function(){
		firebase.database().ref('clients').push(app.model.clients);
	},

	selectDrink: function(dat){
		var client = document.getElementById('client-name').innerHTML;
		var cc = document.getElementById('client').innerHTML;
		for (var key in app.model.clients[cc]) {
			if (key === client){
				app.model.clients[cc][key]['Bebida'] = dat.id;
				break;
			} 
		}
		app.refreshDrink(client);
        app.save();
	},

	loadClients: function(opt){
		if (opt) {
			var cc = document.getElementById('client').innerHTML;
			var users = $('#menu-clients');
			users.html('');
			for (var key in app.model.clients[cc]) {
				var codigo = '';
				codigo += '<div class="radio" onclick="app.refreshClient(this,1);" id="'+key+'" data-dismiss="modal">';
					codigo += '<label>';
						codigo += '<input type="radio" value="'+key+'">&nbsp;&nbsp;';
						codigo += key;
					codigo += '</label>';
				codigo += '</div>';
				codigo += '<br>';
				users.append(codigo);
			}
		}
		else{
			var users = $('#clients');
			users.html('');
			for (var key in app.model.clients) {
				var codigo = '';
				codigo += '<div class="radio" onclick="app.refreshClient(this,0);" id="'+key+'" data-dismiss="modal">';
					codigo += '<label>';
						codigo += '<input type="radio" value="'+key+'">&nbsp;&nbsp;';
						codigo += key;
					codigo += '</label>';
				codigo += '</div>';
				codigo += '<br>';
				users.append(codigo);
			}
		}	
	},

	refreshClient: function(dat,opt){
        if (!dat.id) {
            document.getElementById('client-name').innerHTML = "No ha seleccionado nombre";
            document.getElementById('client-drink').innerHTML = "No ha seleccionado bebida";
        }
        else if(opt){
            document.getElementById('client-name').innerHTML = dat.id;
            app.refreshDrink(dat.id);
        }
        else if(!opt){
            document.getElementById('client').innerHTML = dat.id;
        }
	},

	refreshDrink: function(client){
		var aux = 0;
		var cc = document.getElementById('client').innerHTML;
		for (var key in app.model.clients[cc]) {
			if (key === client){
				if (app.model.clients[cc][key]['Bebida']) {
					document.getElementById('client-drink').innerHTML = app.model.clients[cc][key]['Bebida'];
					aux = 1;
				}
				break;
			} 
		}
		if (!aux) {
            if (client === 'Nombre') {
                alert("No ha seleccionado nombre");
                document.getElementById('client-name').innerHTML = "No ha seleccionado nombre";
            }
            else{
                alert("No ha seleccionado bebida");
                document.getElementById('client-drink').innerHTML = "No ha seleccionado bebida";
            }
		}
	},

    sendMail: function(){
        var codigo = '<table class="table table-bordered"';
				codigo += '<tbody>';
					codigo += '<tr>';
						codigo += '<th>Empresa</th>';
						codigo += '<th>Nombre</th>';
						codigo += '<th>Bebida</th>';
                        codigo += '<th>Comentario</th>';
					codigo += '</tr>';
				for (var key in app.model.clients) {
						for(var key2 in app.model.clients[key]){
							codigo += '<tr>';
								codigo += '<td>'+key+'</td>'
								codigo += '<td>'+key2+'</td>';
								codigo += '<td>'+app.model.clients[key][key2]['Bebida']+'</td>';
		                        codigo += '<td>'+app.model.clients[key][key2]['Coment']+'</td>';
							codigo += '</tr>';
                    	}
				}
				codigo += '</tbody>';
			codigo += '</table>';
        emailjs.send("gmail","template_173DO73o",{message_html: codigo});
        //app.saveFirebase();
    },

}

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function(){
        app.initFirebase();
    }, false);
}

