//CONSTRUCTOR DE BOLAS
Ball = function(i) {
  this.r = 16;

  //POSICION INICIAL DE LAS BOLAS
  this.x = 200 + ((i - (i % 2)) * this.r * 15);
  this.y = 120 + ((3 - (i % 2)) * this.r * i * 5) - 200 * (i - (i % 2));

  this.opacity = 0.8;
  this.xVelocity = 0;
  this.yVelocity = 0;
  this.xAccel = 0;
  this.yAccel = 0;
  this.bounceLoss = bounceLoss; //UNA CONSTANTE DEFINIDA GLOBALMENTE AL INICIO
  this.tableFriction = tableFriction; //UNA CONSTANTE DEFINIDA GLOBALMENTE AL INICIO
  this.c = colors[i]; //ASIGNAR A CADA BOLA UN COLOR UNIVOCO
  this.index = i; // NUMERO PARA IDENTIFICAR A LAS BOLAS UNIVOCAMENTE
};


//METODO PARA QUE DIBUJE LAS BOLAS
Ball.prototype.draw = function(table) {
  ctx.fillStyle = this.c;
  ctx.globalAlpha = this.opacity;
  ctx.beginPath();
  ctx.arc(this.x + table.xPos,
    this.y + table.yPos,
    this.r, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.closePath();
};

//METODO PARA QUE SE ACTUALICE LA POSICIÓN DE LAS BOLAS
Ball.prototype.Update = function(table) {
  //MODIFICA A LO LARGO DEL TIEMPO LA VELOCIDAD Y ACELERACION DE LAS BOLAS
  var dT = 1000 / refreshHz;
  this.xAccel = this.xVelocity * -this.tableFriction * dT;
  this.yAccel = this.yVelocity * -this.tableFriction * dT;
  this.yVelocity += this.yAccel * dT;
  this.xVelocity += this.xAccel * dT;
  this.y += this.yVelocity * dT;
  this.x += this.xVelocity * dT;

  //LOGICA PARA CONTROLAR LOS REBOTES CON LOS LATERALES DE LA MESA
  var bounce = false;

  //REBOTE EN LA PARTE INFERIOR
  if (this.y >= table.height - this.r) {
    //ESTO NOS ASEGURA QUE NO HAY OVERLAP DEBIDO A LA ALTA VELOCIDAD DE LA BOLA
    this.y = table.height - this.r;

    //ESTO GENERA EL REBOTE
    this.yVelocity = -this.yVelocity;
    this.yAccel = -this.yAccel;
    bounce = true;
  }
  //REBOTE EN LA PARTE SUPERIOR
  else if (this.y <= this.r) {
    this.y = this.r;
    this.yVelocity = -this.yVelocity;
    this.yAccel = -this.yAccel;
    bounce = true;
  }

  //REBOTE EN EL LATERAL DERECHO
  if (this.x >= table.width - this.r) {
    this.x = table.width - this.r;
    this.xVelocity = -this.xVelocity;
    this.xAccel = -this.xAccel;
    bounce = true;

    //REBOTE EN EL LATERAL IZQUIERDO
  } else if (this.x <= this.r) // Ball at left edge
  {
    this.x = this.r;
    this.xVelocity = -this.xVelocity;
    this.xAccel = -this.xAccel;
    bounce = true;
  }

  // ACTUALIZA LA VELOCIDAD DE LA BOLA SI SE PRODUCE UN REBOTE
  if (bounce) {
    this.xVelocity *= this.bounceLoss;
    this.yVelocity *= this.bounceLoss;
  }

  // PARA LA BOLA CUANDO LLEGA A LA "velocityCutoff" SE PARA
  if (Math.abs(this.xVelocity) + Math.abs(this.yVelocity) < velocityCutoff) {
    this.yVelocity = 0;
    this.yAccel = 0;
    this.xVelocity = 0;
    this.xAccel = 0;
  }

};

// CAMBIO DE VELOCIDAD AL GOLPEAR LAS BOLAS
Ball.prototype.Strike = function(xImpact, yImpact) {
  for (var i = 0; i < players.length; i++) {
    players[i].hitWhiteBall = false;
    players[i].hitTheOtherBall = false;
  }
  this.xVelocity += xImpact;
  this.yVelocity += yImpact;
  strike = true;
  played = true;
  strikeBall = this;

};

// CAMBIO DE VELOCIDAD EN LA COLISION DE LAS BOLAS (Caja Negra!!)
function CollideBalls(ball, ball2) {
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

}

// CHEQUEAR EL IMPACTO DE LAS BOLAS
Ball.prototype.TestImpact = function() {
  for (var i = this.index + 1; i < points; i++) {
    var ball = balls[i];
    if (Dist(this.x, this.y, ball.x, ball.y) > this.r + ball.r) //CALCULAMOS LA DISTANCIA ENTRE 2 PUNTOS
    {
      continue;
    }

    //THIS = BOLA CON LA QUE SE DISPAEA  BALL= BOLA CON LA QUE COLISIONA
    CollideBalls(this, ball);
    console.log('EN TEST IMPACT: ', this);

     if (!turn1) {
      this._checkCarambolaP2(ball);
      break; //PARA QUE NO ANOTE PUNTOS UNA VEZ QUE SE HA HECHO CARAMBOLA
      }
    else if (turn1) {
    this._checkCarambolaP1(ball);
    break; //PARA QUE NO ANOTE PUNTOS UNA VEZ QUE SE HA HECHO CARAMBOLA
  }
}


// CHEQUEAR SI SE HACE CARAMBOLA PLAYER 1
Ball.prototype._checkCarambolaP1 = function(ball) {
  //VERIFICAR QUE SE HACE CARAMBOLA

  if (turn1 && this.c === 'blue' && ball.c === 'yellow') players[0].hitTheOtherBall = true;
  if (turn1 && this.c === 'blue' && ball.c === 'white') players[0].hitWhiteBall = true;
  if (turn1 && this.c === 'blue' && players[0].hitTheOtherBall && players[0].hitWhiteBall && played) {
    players[0].myPoints+=1; //SUMA PUNTOS CON LAS CARAMBOLAS
    document.getElementById("score1").innerHTML = players[0].myPoints;
    turn1 = true;
    console.log('CARAMBOLA');
    alert ("CARAMBOLAAAAAAAAAA!!!! BIEN HECHO! VUELVE A TIRAR JUGADOR AZUL!");
    console.log('Puntos P1' + players[0].myPoints);
    played = false;
  }
  };

  // CHEQUEAR SI SE HACE CARAMBOLA PLAYER 2
  Ball.prototype._checkCarambolaP2 = function(ball) {

    //VERIFICAR QUE SE HACE CARAMBOLA
    if (!turn1 && this.c === 'yellow' && ball.c === 'blue') players[1].hitTheOtherBall = true;
    if (!turn1 && this.c === 'yellow' && ball.c === 'white') players[1].hitWhiteBall = true;
    if (!turn1 && this.c === 'yellow' && players[1].hitTheOtherBall && players[1].hitWhiteBall) {
      players[1].myPoints++; //SUMA PUNTOS CON LAS CARAMBOLAS
      document.getElementById("score2").innerHTML = players[1].myPoints;
      turn1 = false;
      console.log('CARAMBOLA');
      alert ("CARAMBOLAAAAAAAAAA!!!! BIEN HECHO! VUELVE A TIRAR JUGADOR AMARILLO!");
      console.log('Puntos P2' + players[1].myPoints);

    }
    };
};


// if (!turn1 && this.c === 'yellow' && ball.c === 'blue') players[1].hitTheOtherBall = true;
// if (!turn1 && this.c === 'yellow' && ball.c === 'white') players[1].hitWhiteBall = true;
// if (!turn1 && this.c === 'yellow' && players[1].hitTheOtherBall && players[1].hitWhiteBall) {
// players[1].myPoints++;
//
// document.getElementById ("score2").innerHTML = players[1].myPoints;
// console.log('CARAMBOLA');
// alert ("CARAMBOLAAAAAAAAAA!!!! BIEN HECHO! VUELVE A TIRAR PLAYER 2!");
// console.log('Puntos P2' + players[1].myPoints);
// //alert ("CONTINUA EL JUGADOR 2 UN DISPARO AMARILLO");
// turn1 = false;
//
// }
// };
