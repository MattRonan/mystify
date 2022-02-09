//mystify screensaver in javascript 2016 Matt Ronan 

//--------------------------Mystify----------------------
function Mystify() {
  var canvas = document.getElementById("mystify");
  this.width = canvas.width;
  this.height = canvas.height;
  this.context = canvas.getContext("2d");
  this.paused = false;
  this.blur = false;
}

//---------------------------------ColorFader----------------------------
function ColorFader() {
  this.vals = [0,255,0];
  this.ind = 1;
  this.fadeSpeed = 1;
}  
ColorFader.prototype.init = function(){
  this.ran =.3;//= Math.random();
  if(this.ran < .33)
    this.vals[0] = 255;
  else if(this.ran > .66)
    this.vals[2] = 255;
  else
    this.vals[1] = 255;
  
}

ColorFader.prototype.update = function(){
    if(this.vals[this.ind] < 255){
    this.vals[this.ind] += this.fadeSpeed;
    if(this.ind == 0)
      this.vals[2] -= this.fadeSpeed;   
    else
      this.vals[this.ind-1] -= this.fadeSpeed;
    }
    else{
    this.ind++;
    if(this.ind > 2)
      this.ind = 0;
    }
}

ColorFader.prototype.getColor = function(){
  var stringColor = "rgb(" +this.vals[0]+ "," +this.vals[1]+ "," +this.vals[2]+ ")";
  return stringColor;
}

//----------------------------Thing------------------------------
function Thing(){
  
  this.numPoints = 4;
  this.numLines = 7;
  this.minV = 2; this.maxV = 10;
  this.rRange = this.maxV - this.minV;
  this.initialized = 0;
  this.colorFader = new ColorFader();
  this.pointLoc = []; 
  this.pointVel = [];
  this.col = "rgb(255,0,0)";
}

Thing.prototype.init = function(){
    for(var i = 0; i < this.numLines; i++){
      this.pointLoc[i] = [];
        for(var ii = 0; ii < this.numPoints; ii++){
      if(i == 0){
        this.pointLoc[i][ii] = new PVector(Math.random()*mystify.width,Math.random()*mystify.height); 
        this.pointVel[ii] = new PVector(0,0);
        this.pointVel[ii].x = Math.random()*this.rRange+this.minV; this.pointVel[ii].y = Math.random()*this.rRange+this.minV;
      }
      else{
        this.pointLoc[i][ii] = new PVector(0,0);
        this.pointLoc[i][ii].x = this.pointLoc[0][ii].x;//start all the blur lines in the same place
        this.pointLoc[i][ii].y = this.pointLoc[0][ii].y;
      }
        }
    } 
}

Thing.prototype.update = function(){

  if(this.initialized == 0){
    this.init();
    this.initialized = 1;
  }
    
  //only add velocity to the first (leading) points.  All the others are just copies of previous points
    for(var i = 0; i < this.numPoints; i++){
    this.pointLoc[0][i].add(this.pointVel[i]); 
    this.checkWallCollisions(i);
    }
    
    this.drawThing();
  
    //now shift the location array to the right
    for(var i = this.numLines-1; i > 0; i--){
        for(var ii = 0; ii < this.numPoints; ii++){
      this.pointLoc[i][ii].x = this.pointLoc[i-1][ii].x;this.pointLoc[i][ii].y = this.pointLoc[i-1][ii].y;
    }
    }
} 

Thing.prototype.checkWallCollisions = function(i){
    //l r t b
  
    if(this.pointLoc[0][i].x < 0)
    this.pointVel[i].x = Math.random()*this.rRange+this.minV;
    else if(this.pointLoc[0][i].x > mystify.width)
    this.pointVel[i].x = -1*(Math.random()*this.rRange+this.minV);
    if(this.pointLoc[0][i].y < 0)
    this.pointVel[i].y = Math.random()*this.rRange+this.minV;
    else if(this.pointLoc[0][i].y > mystify.height)
    this.pointVel[i].y = -1*(Math.random()*this.rRange+this.minV);
}
Thing.prototype.drawThing = function(){
    this.colorFader.update();
  this.col = this.colorFader.getColor();
  mystify.context.beginPath();
  mystify.context.strokeStyle = this.col;
    for(var i = 0; i < this.numLines; i++){
    mystify.context.moveTo(this.pointLoc[i][0].x,this.pointLoc[i][0].y);
    for(var ii = 1; ii < this.numPoints; ii++){
      mystify.context.lineTo(this.pointLoc[i][ii].x,this.pointLoc[i][ii].y);
      mystify.context.moveTo(this.pointLoc[i][ii].x,this.pointLoc[i][ii].y);
    }
    mystify.context.lineTo(this.pointLoc[i][0].x,this.pointLoc[i][0].y);
    mystify.context.stroke();
    //mystify.context.endPath();
    }
}
//-----------------------------end Thing----------------------------------------

function loop() {

  //BG
  if(mystify.paused == false){
    if(mystify.blur == false)
      mystify.context.fillStyle = "rgb(0,0,0)"; 
    else
      mystify.context.fillStyle = "rgba(0,0,0,.01)";  
    mystify.context.fillRect(0,0,mystify.width,mystify.height);
    thing1.update();
  }

  //--------------------debug line---------------------
  document.getElementById("debug").innerHTML = "debug: " + thing1.col + " ";
    //--------------------------------------------------
  
  setTimeout(loop, 33.3333);
}

function resetChecks(b1,b2,b3){
  var box = document.getElementById(b1);
  box.checked = false;
  box = document.getElementById(b2);
  box.checked = false;
  box = document.getElementById(b3);
  box.checked = false;
  
}

function checkBoxManager(b){
  var box = document.getElementById(b);
  
  if(box.checked == true){
    if(b == "bM")
      mystify.blur = true;
    else if(b == "pau")
      mystify.paused = true;
    else if(b == "deb")
      document.getElementById("debug").style.display = "block";
  }
  else{
    if(b == "bM")
      mystify.blur = false;
    else if(b == "pau")
      mystify.paused = false;
    else if(b == "deb")
      document.getElementById("debug").style.display = "none";
  }
} 

// setup
var mystify = new Mystify();
var thing1 = new Thing();

//start the loop
loop();
