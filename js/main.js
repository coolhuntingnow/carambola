

  var ctx;
//ASEGURARNOS QUE NO SE EJECUTE EL JS HASTA QUE NO SE CARGE EL DOM
window.onload = function() {

  //CONECTAR EL CANVAS EN HTML CON EL JavaScript
  var canvas = document.getElementById('tablero');
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;
  ctx = canvas.getContext('2d');



  // FUNCION DIBUJAR EL TABLERO DEL JUEGO
    function draw() {

        var anchoTablero = 620;
        var largoTablero = 440;

        var anchoMesa = 30;

        // Posición del Tablero con respecto al CANVAS
        x = 200;
        y = 200;
        ctx.fillStyle = "brown";
        ctx.fillRect(x, y, anchoTablero, largoTablero);

        ctx.fillStyle = "green";
        ctx.fillRect(x + anchoMesa, y + anchoMesa, anchoTablero - anchoMesa*2, largoTablero - anchoMesa*2);
    }
    // DIBUJAR EL TABLERO DEL JUEGO
      draw();

  var bolaRoja = new Bola ("red");
  bolaRoja.pintaBola ();

};
