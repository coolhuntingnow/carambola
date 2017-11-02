# carambola
Juego Online de Billar Frances


LOGICA DEL MOVIMIENTO DE LAS BOLAS

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
