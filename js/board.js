
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
