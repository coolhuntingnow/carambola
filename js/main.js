
//PARA QUE NO CARGUE EL JS SIN QUE SE HAYA CARGADO EL DOM
//window.onload = function() {

//INSERTAR EL CANVAS EN EL DOM
  var canvas = document.getElementById('canvas'),

//ACCESO A MANIPULAR EL CANVAS
  ctx = canvas.getContext('2d'),

// This will return the width and Height of the viewport
  w = window.innerWidth,
  h = window.innerHeight,

//NUMERO DE BOLAS
  points = 3,

//COLORES DE BOLAS
  colors = ["red", "white", "yellow"],
  numColors = 3,

  balls = [],
  table,

//
  mouse = {
    down: false,
  	button: 1,
  	x: 0,
  	y: 0,
  	px: 0,
  	py: 0
  },
  mouseDownX = 0,
  mouseDownY = 0,
  elasticity = 0.8, // FUERZA QUE SE TRASMITEN LAS BOLAS AL COLISIONAR
  refreshHz = 60, //MODIFICA EL TIEMPO QUE TARDA EN PARARSE LA BOLA
  velocityCutoff = 0.01, //MODIFICA LA VELOCIDAD A LA QUE SE PARA LA BOLA
  bounceLoss = 0.6, //MODIFICA EL REBOTE
  tableFriction = 0.00005, //EL ROZAMIENTO DE LA MESA SOBRE LAS BOLAS
  mPerPixel = 0.0
  ;

  var MouseHandler = {
    onmousedown: function(e)
    {
      mouse.button = e.which;
      mouse.px = mouse.x;
      mouse.py = mouse.y;

      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.down = true;

      mouseDownX = mouse.x;
      mouseDownY = mouse.y;

      e.preventDefault();
    },
    onmouseup: function(e)
    {
      mouse.down = false;

      HitBall();

      e.preventDefault();
    },
    onmousemove: function(e)
    {
      if (mouse.down == true)
      {
        mouse.px = mouse.x;
        mouse.py = mouse.y;

        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      }
    }
  };

// ASIGNAMOS AL CANVAS EL TAMAÑO DEL VIEWPORT
  canvas.width = w;
  canvas.height = h;

// SOLICITA A LOS DIFERENTES NAVEGADORES QUE CARGUEN EL REPITANDO DE LA VENTANA ANTES DEL PROXIMO CICLO DE ANIMACIÓN

  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||

// LLAMAR A LA FUNCION CALLBACK TRAS (1000 / refreshHz) MILISEGUNDOS
            function( callback ){
              window.setTimeout(callback, 1000 / refreshHz);
            };
  })(); // *ESTO ES LA LLAMADA DE UNA FUNCION ANONIMA, NO??

  window.onload = function()
  {
    canvas.onmousedown = MouseHandler.onmousedown;
    canvas.onmouseup = MouseHandler.onmouseup;
    canvas.onmousemove = MouseHandler.onmousemove;

    canvas.ontouchstart = MouseHandler.onmousedown;
    canvas.ontouchend = MouseHandler.onmouseup;
    canvas.ontouchmove = MouseHandler.onmousemove;

    draw();
  };

//DISEÑO DEL TABLERO
  var Table = function(){
    //POSICION DEL TABLERO CON RESPECTO AL VIEWPORT
    this.xPos = 150;
    this.yPos = 150;

    //TAMAÑO DEL TABLERO CON RESPECTO AL VIEWPORT
    this.width = 0.7*w;
    this.height = 0.3*w;

    //DISEÑO DEL TABLERO
    this.tableColor = "green"
    this.borderColor = "black-brown"; //CAMBIA EL COLOR AL HACER CLICK CON EL RATON
    this.innerBorderColor = "black";
    this.border = 20;
  }

  Table.prototype.draw = function(){

    var leftBorder = this.xPos - (this.border / 2.0);
    var rightBorder = leftBorder + this.width + this.border;
    var topBorder = this.yPos - (this.border / 2.0);
    var bottomBorder = topBorder + this.height + this.border;

    // Draw the table border
    ctx.beginPath();
    ctx.moveTo(leftBorder, topBorder);
    // Top edge
    ctx.lineTo(rightBorder, topBorder);
    // Right edge
    ctx.lineTo(rightBorder, bottomBorder);
    // Bottom edge
    ctx.lineTo(leftBorder, bottomBorder);
    // Left edge
    ctx.lineTo(leftBorder, topBorder - this.border / 2.0);
    ctx.closePath();
    // Draw it
    ctx.lineWidth = this.border;

    ctx.globalAlpha = .5;
    ctx.strokeStyle = this.borderColor;
    ctx.stroke();

    // Draw the rebound box
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.moveTo(this.xPos, this.yPos);
    ctx.lineTo(this.xPos + this.width, this.yPos);
    ctx.lineTo(this.xPos + this.width, this.yPos + this.height);
    ctx.lineTo(this.xPos, this.yPos + this.height);
    ctx.lineTo(this.xPos, this.yPos);
    ctx.closePath();

    ctx.lineWidth = 2;
    ctx.strokeStyle = this.innerBorderColor;
    ctx.stroke();

    // Draw the table
    ctx.beginPath();
    ctx.fillStyle = this.tableColor;
    ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
    ctx.fill();
    ctx.closePath();
  }

//CONSTRUCTOR DE BOLAS
  var Ball = function(i){
    this.r = 12;

    //POSICION INICIAL DE LAS BOLAS
    this.x = 100 + ((i - (i % 2)) * this.r * 15);
    this.y = 50 + (2 * (i % 2) * this.r*5);

    this.opacity = 0.8;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.xAccel = 0;
    this.yAccel = 0;
    this.bounceLoss = bounceLoss; //UNA CONSTANTE DEFINIDA GLOBALMENTE AL INICIO
    this.tableFriction = tableFriction; //UNA CONSTANTE DEFINIDA GLOBALMENTE AL INICIO
    this.c = colors[i]; //ASIGNAR A CADA BOLA UN COLOR UNIVOCO
    this.index = i; // NUMERO PARA IDENTIFICAR A LAS BOLAS UNIVOCAMENTE
  }

  Ball.prototype.draw = function(table) {
    ctx.fillStyle = this.c;
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x + table.xPos,
            this.y + table.yPos,
            this.r,0,Math.PI*2,true);
    ctx.fill();
    ctx.closePath();
  };

  Ball.prototype.Update = function(table) {
    var dT = 1000/refreshHz;
    this.xAccel = this.xVelocity * -this.tableFriction * dT;
    this.yAccel = this.yVelocity * -this.tableFriction * dT;
    this.yVelocity += this.yAccel * dT;
    this.xVelocity += this.xAccel * dT;
    this.y += this.yVelocity * dT;
    this.x += this.xVelocity * dT;

    var bounce = false;
    if (this.y >= table.height - this.r) // Ball at bottom edge
    {
      this.y = table.height - this.r;
      this.yVelocity = -this.yVelocity;
      this.yAccel = -this.yAccel;
      bounce = true;
    }
    else if (this.y <= this.r) // Ball at top edge
    {
      this.y = this.r;
      this.yVelocity = -this.yVelocity;
      this.yAccel = -this.yAccel;
      bounce = true;
    }

    if (this.x >= table.width - this.r) // Ball at right edge
    {
      // Make sure there is no overlap over the edge at all
      //  because x is probably past the edge by < velocity
      this.x = table.width - this.r;
      // "Bounce" it
      this.xVelocity = -this.xVelocity;
      this.xAccel = -this.xAccel;
      bounce = true;
    }
    else if (this.x <= this.r) // Ball at left edge
    {
      this.x = this.r;
      this.xVelocity = -this.xVelocity;
      this.xAccel = -this.xAccel;
      bounce = true;
    }

    // Update velocity
    if (bounce)
    {
      this.xVelocity *= this.bounceLoss;
      this.yVelocity *= this.bounceLoss;
    }

    if (Math.abs(this.xVelocity) + Math.abs(this.yVelocity) < velocityCutoff)
    {
      this.yVelocity = 0;
      this.yAccel = 0;
      this.xVelocity = 0;
      this.xAccel = 0;
    }

  };

  Ball.prototype.Strike = function(xImpact, yImpact)
  {
    this.xVelocity += xImpact;
    this.yVelocity += yImpact;
  };

  function CollideBalls(ball, ball2)
  {
    var Del = ball2.r + ball.r;
    var dX = ball2.x - ball.x;
    var dY = ball2.y - ball.y;
    var dVX = ball2.xVelocity - ball.xVelocity;
    var dVY = ball2.yVelocity - ball.yVelocity;
    var dSq = dX * dX + dY * dY;
    var alpha = (1 + elasticity) / 2 * (dX * dVX + dY * dVY) / dSq;

    ball.xVelocity += dX * alpha;
    ball.yVelocity += dY * alpha;
    ball2.xVelocity -= dX * alpha;
    ball2.yVelocity -= dY * alpha;

    var DDist = ((Del + 1) / Math.sqrt(dSq) - 1) / 2;
    ball.x -= dX * DDist;
    ball.y -= dY * DDist;
    ball2.x += dX * DDist;
    ball2.y += dY * DDist;
    /*
    var dX = ball.x - ball2.x;
    var dY = ball.y - ball2.y;
    var theta = Math.atan2(ball.yVelocity - dY, ball.xVelocity - dX);

    var vMag1 = Math.sqrt(ball.xVelocity * ball.xVelocity + ball.yVelocity * ball.yVelocity);
    var vMag2 = Math.sqrt(ball2.xVelocity * ball2.xVelocity + ball2.yVelocity * ball2.yVelocity);

    var direction1 = Math.atan2(ball.yVelocity, ball.xVelocity);
    var direction2 = Math.atan2(ball2.yVelocity, ball2.xVelocity);

    var vX1 = vMag1 * Math.cos(direction1 - theta);
    var vY1 = vMag1 * Math.sin(direction1 - theta);
    var vX2 = vMag2 * Math.cos(direction2 - theta);
    var vY2 = vMag2 * Math.sin(direction2 - theta);

    var xVelocity1 = Math.cos(theta) * vX1 + Math.cos(theta + Math.PI/2) * vY1;
    var yVelocity1 = Math.sin(theta) * vX1 + Math.sin(theta + Math.PI/2) * vY1;
    var xVelocity2 = Math.cos(theta) * vX2 + Math.cos(theta + Math.PI/2) * vY2;
    var yVelocity2 = Math.sin(theta) * vX2 + Math.sin(theta + Math.PI/2) * vY2;

    ball.xVelocity = xVelocity2;
    ball.yVelocity = yVelocity2;
    ball2.xVelocity = xVelocity1;
    ball2.yVelocity = yVelocity1;*/
  }

  Ball.prototype.TestImpact = function()
  {
    for (var i = this.index + 1; i < points; i++)
    {
      var ball = balls[i];
      if (Dist(this.x, this.y, ball.x, ball.y) > this.r + ball.r )
      {
          continue;
      }

      CollideBalls(this, ball);
    }
  }

  function HitBall()
  {
    for (var i = 0; i < points; i++)
    {
      var tempBall = balls[i];
      if (Dist(tempBall.x + table.xPos, tempBall.y + table.yPos, mouseDownX, mouseDownY) < tempBall.r)
      {
        var dX = mouseDownX - mouse.x;
        var dY = mouseDownY - mouse.y;
        tempBall.Strike(dX / 50.0, dY / 50.0);
      }
    }
  }

  function Dist(x1, y1, x2, y2)
  {
    var diffX = x2 - x1;
    var diffY = y2 - y1;
    return Math.sqrt((diffX * diffX) + (diffY * diffY));
  }

// DIBUJAR LA LINEA DEL RATON AL CLICAR LA BOLA
  function DrawMouse()
  {
    ctx.beginPath();
    ctx.moveTo(mouseDownX, mouseDownY); // EL PALO SE EMPIEZA A PINTAR DESDE DONDE HACEMOS CLICK
    ctx.lineTo(mouse.x, mouse.y); //DIBUJA EL PALO HASTA DONDE ME MUEVA CON EL RATON
    ctx.strokeStyle = 'brown'; // COLOR DE PALO
    ctx.lineWidth = 8; // ANCHO DEL PALO
    ctx.stroke();
  }

  (function init(){
    for(var i = 0; i<points;i++){
      balls.push(new Ball(i));
    }
    table = new Table();
  })();

  function draw(){
    ctx.clearRect(0,0,w,h);
    table.draw();
    for(var i = 0; i<points;i++){
      var temp = balls[i];
      temp.TestImpact();
      temp.Update(table);
      temp.draw(table);
    }

// MUESTRA EL PALO SIEMPRE QUE PULSEMOS EL RATON
    if (mouse.down == true)
    {
      DrawMouse();
    }
    requestAnimFrame(draw);
  }


//};
