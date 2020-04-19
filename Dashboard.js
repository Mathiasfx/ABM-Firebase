//INICIALIZA CONEXION CON FIREBASE
firebase.initializeApp({
    apiKey:"AIzaSyAvyMMdbvyX5Tlp3tYL6lsQSR64KB4ISU0",
    authDomain:"consola-a8c46.firebaseapp.com",
    projectId:"consola-a8c46"
});


//FUNCION DE SESSION ACTIVA
function observador(){    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.        
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          // ...
          console.log('LLego Alguien');

        } else {
          // User is signed out.
          console.log('No hay nadie');
          window.location="index.html";
          // ...
        }
      });
      
}
observador();

var db = firebase.firestore();

//LEER DB
var tdata = document.getElementById('tdata');
db.collection("Empresa").onSnapshot((function(querySnapshot) {  
  tdata.innerHTML = '';
  querySnapshot.forEach(function(doc) {      
      console.log(doc.id, " => ", doc.data());
      tdata.innerHTML +=`
        <tr class="text-center">                            
           <td>${doc.data().nombre}</td>                           
           <td class="text-left">${doc.data().direccion}</td>
           <td>${doc.data().telefono_fijo}</td>
           <td>${doc.data().telefono_celular}</td>
           <td>${doc.data().email}</td>     
           <td><button class="btn btn-success" data-toggle="modal" data-target="#AGREGA" onclick="editar('${doc.id}','${doc.data().nombre}','${doc.data().direccion}','${doc.data().telefono_fijo}','${doc.data().telefono_celular}','${doc.data().email}') ">Editar</button></td>                                        
           <td><a class="text-danger"  href="#"> <i class="fas fa-trash-alt"  onclick="eliminar('${doc.id}')"></i></a></td>
           </tr>
           `
  });
}));

let file = {};

function subirarchivo(e){
  file = e.target.files[0];
}


//GUARDAR DATOS
function guardar(){
      
     




      var nombre = document.getElementById('nombre').value;
      var direccion = document.getElementById('direccion').value;
      var logo = document.getElementById('imagen_logo').value;
      //var imagen_portada = document.getElementById('imagen_portada').value;
      var telefono_fijo = document.getElementById('telefono_fijo').value;
      var telefono_celular = document.getElementById('telefono_celular').value;
      var email = document.getElementById('email').value;
      db.collection("Empresa").add({

         nombre: nombre,
         direccion: direccion,
         //imagen_logo: logo,
        // //imagen_portada:imagen_portada,
         telefono_fijo: telefono_fijo,
         telefono_celular: telefono_celular,
         email: email

    }
    
    )
    .then(function(docRef) {
        console.log("Documento creado: ", docRef.id);
        document.getElementById('nombre').value = '';
        document.getElementById('direccion').value = '';
        document.getElementById('telefono_fijo').value = '';
        document.getElementById('telefono_celular').value = '';
        document.getElementById('email').value = '';
    })
    .catch(function(error) {
        console.error("Error al crear documento: ", error);
    });
    firebase.storage().ref('Empresa/logo/logoempresa.jpg').put(file).then(function(){

    }).catch(error =>{
      console.log(error.message);
    })
}


//ELIMINAR DATOS
function eliminar(id){
  db.collection("Empresa").doc(id).delete().then(function() {
    console.log("Document successfully deleted!");
}).catch(function(error) {
    console.error("Error removing document: ", error);
});
}
//ACTUALIZAR DATOS
function editar(id,nombre,direccion,telefono_fijo,telefono_celular,email){

  document.getElementById('nombre').value = nombre;
  document.getElementById('direccion').value = direccion;
  document.getElementById('telefono_fijo').value = telefono_fijo;
  document.getElementById('telefono_celular').value = telefono_celular;
  document.getElementById('email').value = email;
  var boton = document.getElementById('btn_form');

  boton.innerHTML = 'Actualizar';

  boton.onclick = function(){
    var washingtonRef = db.collection("Empresa").doc(id);

    var nombre = document.getElementById('nombre').value;
    var direccion = document.getElementById('direccion').value;
    var telefono_fijo = document.getElementById('telefono_fijo').value;
    var telefono_celular = document.getElementById('telefono_celular').value;
    var email = document.getElementById('email').value;
    return washingtonRef.update({ 

        nombre: nombre,
        direccion: direccion,
        telefono_fijo: telefono_fijo,
        telefono_celular: telefono_celular,
        email: email


    })
    .then(function(){
      console.log("Documento Actualizado!")
      boton.innerHTML = 'Guardar';
      document.getElementById('nombre').value = '';
      document.getElementById('direccion').value = '';
      document.getElementById('telefono_fijo').value = '';
      document.getElementById('telefono_celular').value = '';
      document.getElementById('email').value = '';
    })
    .catch(function(error){
      console.log("Error al Actualizar: ", error);
    });

  }
}

//CERRAR SESSION 
function CerrarSession(){
    firebase.auth().signOut();
}

 
