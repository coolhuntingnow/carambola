//DECLARACION DE VARIABLES GLOBALES
var Player;
var Players;
var Table;
var Ball;
var MouseHandler;
var strike = false
var strikeBall

//PARA QUE NO CARGUE EL JS SIN QUE SE HAYA CARGADO EL DOM
window.onload = function() {
  canvas.onmousedown = MouseHandler.onmousedown;
  canvas.onmouseup = MouseHandler.onmouseup;
  canvas.onmousemove = MouseHandler.onmousemove;

  canvas.ontouchstart = MouseHandler.onmousedown;
  canvas.ontouchend = MouseHandler.onmouseup;
  canvas.ontouchmove = MouseHandler.onmousemove;

  draw();
};

//INSERTAR EL CANVAS EN EL DOM
var canvas = document.getElementById('canvas'),

  //ACCESO A MANIPULAR LOS OBJETOS EL CANVAS
  ctx = canvas.getContext('2d'),

  // ASIGNAMOS EL ALTO Y ANCHO DEL VIEWPORT A UNAS VARIABLES
  w = window.innerWidth,
  h = window.innerHeight,

  //NUMERO DE BOLAS
  points = 3,

  //CAMBIO DE TURNO
  turn1 = true,

  //COLORES DE BOLAS
  colors = ["blue", "yellow", "white"],
  balls = [],
  players = [],
  mouse = {
    down: false, //INACTIVO POR DEFECTO
    //button: 1,
    x: 0,
    y: 0,
    px: 0,
    py: 0
  },
  mouseDownX = 0;
mouseDownY = 0;
elasticity = 0.8; // FUERZA QUE SE TRASMITEN LAS BOLAS AL COLISIONAR
refreshHz = 80; //MODIFICA EL TIEMPO QUE TARDA EN PARARSE LA BOLA
velocityCutoff = 0.01; //MODIFICA LA VELOCIDAD A LA QUE SE PARA LA BOLA
bounceLoss = 0.6; //MODIFICA LA VELOCIDAD DE LA BOLA EN LOS REBOTES
tableFriction = 0.00005; //EL ROZAMIENTO DE LA MESA SOBRE LAS BOLAS

// ASIGNAMOS AL CANVAS EL TAMAÑO DEL VIEWPORT
canvas.width = w;
canvas.height = h;

// SOLICITA A LOS DIFERENTES NAVEGADORES QUE CARGUEN EL REPITANDO DE LA VENTANA ANTES DEL PROXIMO CICLO DE ANIMACIÓN
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||

    // LLAMAR A LA FUNCION CALLBACK TRAS (1000 / refreshHz) MILISEGUNDOS
    function(callback) {
      window.setTimeout(callback, 1000 / refreshHz);
    };
})(); // *ESTO ES LA LLAMADA DE UNA FUNCION ANONIMA, NO??

// DIBUJAR LA LINEA DEL RATON AL CLICAR LA BOLA
function DrawMouse() {
  ctx.beginPath();
  ctx.moveTo(mouseDownX, mouseDownY); // EL PALO SE EMPIEZA A PINTAR DESDE DONDE HACEMOS CLICK
  ctx.lineTo(mouse.x, mouse.y); //DIBUJA EL PALO HASTA DONDE ME MUEVA CON EL RATON
  ctx.strokeStyle = 'brown'; // COLOR DE PALO
  ctx.lineWidth = 8; // ANCHO DEL PALO
  ctx.stroke();

}

// GOLPEAR A LAS BOLAS
function HitBall() {
  for (var i = 0; i < points; i++) {
    var tempBall = balls[i];
    if (Dist(tempBall.x + table.xPos, tempBall.y + table.yPos, mouseDownX, mouseDownY) < tempBall.r) {
      var dX = mouseDownX - mouse.x;
      var dY = mouseDownY - mouse.y;
      tempBall.Strike(dX / 50.0, dY / 50.0);
    }
  }
}

function Dist(x1, y1, x2, y2) {
  var diffX = x2 - x1;
  var diffY = y2 - y1;
  return Math.sqrt((diffX * diffX) + (diffY * diffY));
}

// INICIALIZA EL JUEGO CREANDO LOS OBJETOS QUE INTERVIENEN
(function init() {
  for (var i = 0; i < points; i++) {
    balls.push(new Ball(i)); //CREA TODAS LAS BOLAS Y LAS GUARDAMOS EN 1 OBJETO
  }
  table = new Table(); // CREA EL TABLERO

  for (i = 0; i < 2; i++) {
    players.push(new Player(i, balls)); //CREA A LOS JUGADORES

  }
})();

function draw() {
  ctx.clearRect(0, 0, w, h); //BORRA EL CANVAS
  table.draw(); // PINTA EL TABLERO
  for (var i = 0; i < points; i++) {
    var temp = balls[i];
    temp.TestImpact(); //TESTEA CONTINUAMENTE SI LAS BOLAS HAN IMPACTADO
    temp.Update(table); //ACTUALIZA LAS BOLAS EN EL TABLERO
    temp.draw(table); // PINTA LAS BOLAS EN EL TABLERO
  }

  checkTurn()
  // MUESTRA EL PALO SIEMPRE QUE PULSEMOS EL RATON

  if (mouse.down == true) {
    DrawMouse();
  }
  requestAnimFrame(draw);
}

function checkTurn(){

  if(balls[0].xVelocity === 0 && balls[0].yVelocity === 0 &&
     balls[1].xVelocity === 0 && balls[1].yVelocity === 0 &&
     balls[2].xVelocity === 0 && balls[2].yVelocity === 0 && strike){
       if(turn1 && strikeBall.c === 'blue'){
          if(!(players[0].hitWhiteBall && players[0].hitTheOtherBall)) {
            console.log('CBIA TURNO: TURNO DEL 2')
            turn1 = !turn1
            strike = false
          }
       }else{
         if(!turn1 && strikeBall.c === 'yellow' && !(players[1].hitWhiteBall && players[1].hitTheOtherBall)) {
           console.log('CBIA TURNO: TURNO DEL 1')
           turn1 = !turn1
           strike = false
         }
       }
     }
}
