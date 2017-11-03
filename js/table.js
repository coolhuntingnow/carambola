

//DISEÑO DEL TABLERO
  Table = function(){
    //POSICION DEL TABLERO CON RESPECTO AL VIEWPORT
    this.xPos = 250;
    this.yPos = 150;

    //TAMAÑO DEL TABLERO CON RESPECTO AL VIEWPORT
    this.width = 0.6*w;
    this.height = 0.5*this.width;

    //DISEÑO DEL TABLERO
    this.tableColor = "green"
    this.borderColor = "black-brown"; //CAMBIA EL COLOR AL HACER CLICK CON EL RATON
    this.innerBorderColor = "black";
    this.border = 0.073*this.width;
  }


  //METODO PARA QUE DIBUJE EL TABLERO
  Table.prototype.draw = function(){

    var leftBorder = this.xPos - (this.border / 2.0);
    var rightBorder = leftBorder + this.width + this.border;
    var topBorder = this.yPos - (this.border / 2.0);
    var bottomBorder = topBorder + this.height + this.border;

    //DISEÑO DEL BORDE DEL TABLERO
    ctx.beginPath();
    ctx.moveTo(leftBorder, topBorder);
    ctx.lineTo(rightBorder, topBorder);
    ctx.lineTo(rightBorder, bottomBorder);
    ctx.lineTo(leftBorder, bottomBorder);
    ctx.lineTo(leftBorder, topBorder - this.border / 2.0);
    ctx.closePath();
    ctx.lineWidth = this.border;

    ctx.globalAlpha = 0.9; //CAMBIA LA TRANSPARENCIA DEL TABLERO
    ctx.strokeStyle = this.borderColor;
    ctx.stroke();

    // DIBUJO DE LA CAJA DE REBOTE
    ctx.beginPath();
    ctx.globalAlpha = 0.9; //CAMBIAR EL COLOR DEL TAPETE
    ctx.moveTo(this.xPos, this.yPos);
    ctx.lineTo(this.xPos + this.width, this.yPos);
    ctx.lineTo(this.xPos + this.width, this.yPos + this.height);
    ctx.lineTo(this.xPos, this.yPos + this.height);
    ctx.lineTo(this.xPos, this.yPos);
    ctx.closePath();

    ctx.lineWidth = 10; //CAMBIA BORDES MESA
    ctx.strokeStyle = this.innerBorderColor;
    ctx.stroke();

    // DIBUJO DEL TAPETE DE LA MESA
    ctx.beginPath();
    ctx.fillStyle = this.tableColor;
    ctx.fillRect(this.xPos, this.yPos, this.width, this.height);

  }
