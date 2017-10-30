function Bola (color) {
    this.color = color;
    //this.fuerza = fuerza; //Se asigna dinamicamente en cada jugada
    //this.direccion = direccion; //Se asigna dinamicamente en cada jugada
    //this.forma = esferica;
    this.diametro = 61; //Unidad: mm
    this.peso = 220; //Unidad: gramos
    //this.imagen = imagen;
}

Bola.prototype.pintaBola = function(){
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(100,75,50,0,2*Math.PI);
  ctx.stroke();
};



// var bolaRoja = new person("John", "Doe", 50, "blue");
//var myMother = new person("Sally", "Rally", 48, "green");
