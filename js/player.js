
//CONSTRUCTOR DE JUGADORES
  Player = function(i, balls){
    this.myName = "Player "+ i;
    this.myPoints = 0; //INICIO LOS PUNTOS A CERO
    this.myBall = balls[i]; //ASIGNO A CADA JUGADOR UNA BOLA
    this.myIndex = i; // NUMERO PARA IDENTIFICAR A LOS JUGADORES UNIVOCAMENTE
    this.hitWhiteBall = false;
    this.hitTheOtherBall = false;
  };



  
