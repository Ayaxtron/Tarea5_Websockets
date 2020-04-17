//Crear al usuario
function makeToast(player) {
  var msg = 'Bienvenido ' + player;
  $.toast({
    text : msg,
    position : "bottom-right",
    icon: 'alert',
    hideAfter: false
  })
}
//Mostrar cuando jugador se una
function playerJoined(player) {
  var msg = player + " se unio al juego";
  $.toast({
    text : msg,
    position : "bottom-right",
    icon: 'info',
    hideAfter: false
  })
}

//Se inicia una partida y se reinician los valores de la partida anterior
function iniciarP(){
  $("input[type='res']").prop("disabled", false);
  $("input[type='res']").removeClass('is-valid is-invalid')
  $("input[type='res']").val('')
  window.socket.emit("play");
}

//Mostrar la letra y donde contestar el juego
function generarLetra(letter){
  var letter = letter;
  $("#letter").text(letter);
  $("#terminarP").show();
  $("#gameForm").show();
}

function respuestas(){
  //Bloquear sus respuestas
  $("input[type='res']").prop("disabled", true);
  //Se verifica la validez de su respuesta
  if($("#nombre").val() !== ""){

    $("#nombre").addClass("is-valid");
  } else { $("#nombre").addClass("is-invalid"); }
  if($("#pais").val() !== ""){

    $("#pais").addClass("is-valid");
  } else { $("#pais").addClass("is-invalid"); }
  if($("#fruta").val() !== ""){

    $("#fruta").addClass("is-valid");
  } else { $("#fruta").addClass("is-invalid"); }
  if($("#objeto").val() !== ""){

    $("#objeto").addClass("is-valid");
  } else { $("#objeto").addClass("is-invalid"); }

}

function bastaGame(){
  window.socket.emit("finish")
}

window.socket = null
function connectToSocketIo(){
  let server = window.location.protocol + '//' + window.location.host
  window.socket = io.connect(server)

  window.socket.on('init', function(data) {
    player = data.player;
    //Muestra el mensaje del jugador
    makeToast(player);
  });

  window.socket.on('player added', function(data) {
    var players = data.player_names;
    var last_player = players[players.length - 1];
    //Muestra mensaje de nuevo jugador
    playerJoined(last_player);
  });

  window.socket.on('play', function (data) {
    //Letra de la partida
    generarLetra(data.letter);
  })

  window.socket.on('gradeAnswers', function (data) {
    //Para verificar las respuestas de los jugadores
    respuestas();
  })
}

$(function() {
  connectToSocketIo()
})
