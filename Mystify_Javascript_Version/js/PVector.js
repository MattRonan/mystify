//----------------------------constructor
function PVector(x,y){
	this.x = x;
	this.y = y;
	this.magUp = 0;//TODO should track mag and only recalculate when neccessary.  
}

//----------------------------static methods
PVector.add = function(v1,v2){
	var v3 = new PVector(v1.x+v2.x,v1.y+v2.y);
	return v3;
}

//as in Java, v2 is subtracted from v1
PVector.sub = function(v1,v2){
	var v3 = new PVector(v1.x-v2.x,v1.y-v2.y);
	return v3;
}

//------------------------------instance methods
PVector.prototype.get = function(v){
	var v3 = new PVector(v.x,v.y);
	return v3;
}

PVector.prototype.add = function(v){
	this.x += v.x;
	this.y += v.y;
	this.magUp = 1;
}

PVector.prototype.sub = function(v){
	this.x -= v.x;
	this.y -= v.y;
}

PVector.prototype.mult = function(v){
	this.x *= v.x;
	this.y *= v.y;
}

PVector.prototype.div = function(v){
	this.x /= v.x;
	this.y /= v.y;
}

PVector.prototype.mag = function(){
	var magnitude = Math.sqrt( Math.pow(this.x,2) + Math.pow(this.y,2) );
	return magnitude;
}

PVector.prototype.normalize = function(v){
	var magnitude = Math.sqrt( Math.pow(this.x,2) + Math.pow(this.y,2) );
	this.x = this.x/magnitude;
	this.y = this.y/magnitude;
}

PVector.prototype.limit = function(lim){
	var magnitude = Math.sqrt( Math.pow(this.x,2) + Math.pow(this.y,2) );
	
	if(magnitude > lim){
		var fact = magnitude / lim;
		this.x = this.x/fact;
		this.y = this.y/fact;
	}
}