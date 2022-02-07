/* Recreation of the classic 'mystify' screensaver from Windows XP in Processing
/* 2017 Matt Ronan
/*
/* 'p' to pause
/* 'm' to toggle blur mode
/* (click inside window first)
*/

Thing thing1;
int mode = 0;
boolean paused = false;

void setup(){
  
  size(800,600);
  thing1 = new Thing();
  background(0);
}

void draw(){
  
  if(!paused){
    if(mode == 0){//normal mode
      background(0);
    }
    else if(mode == 1){//this is for a blur effect
      fill(0,5);
      rect(0,0,width,height);
    }
  
    thing1.update();
  } 
}

void keyPressed(){
  if(key == 'm' || key == 'M'){
    mode++;
    if(mode == 2)
      mode = 0;
  }
  if(key == 'p' || key == 'P'){
    if(paused)
      paused = false;
    else
      paused  = true;
  }    
}

class Thing{
  
  int numPoints = 4;
  int numLines = 7;
  int minV = 2; int maxV = 7;
  boolean dropShadow = false; //only noticeable in blur mode
  ColorFader colorFader;
  PVector[][] pointLoc = new PVector[numLines][numPoints];
  PVector[] pointVel = new PVector[numPoints];

  public Thing(){
    
    colorFader = new ColorFader();
    
    for(int i = 0; i < numLines; i++){
      for(int ii = 0; ii < numPoints; ii++){
        if(i == 0){
          pointLoc[i][ii] = new PVector((int)random(0,width),(int)random(0,height)); 
          pointVel[ii] = new PVector(0,0);
          pointVel[ii].x = random(minV,maxV); pointVel[ii].y = random(minV,maxV);
        }
        else{
          pointLoc[i][ii] = pointLoc[0][ii];//start all the blur lines in the same place
        }
      }
    }     
  }

  void update(){
    
    //only add velocity to the first (leading) points.  All the others are just copies of previous points
    for(int i = 0; i < numPoints; i++){
      pointLoc[0][i].add(pointVel[i]); 
      checkWallCollisions(i);
    }
    
    drawThing();
    
    //now shift the location array to the right
    for(int i = numLines-1; i > 0; i--){
      for(int ii = 0; ii < numPoints; ii++){
        pointLoc[i][ii] = pointLoc[i-1][ii].get();
      }
    }
  } 
  
  void checkWallCollisions(int in){
    //l r t b
    if(pointLoc[0][in].x < 0){
      pointVel[in].x = random(minV,maxV);
    }  
    else if(pointLoc[0][in].x > width){
      pointVel[in].x = (-1*random(minV,maxV));
    }
    if(pointLoc[0][in].y < 0){
      pointVel[in].y = random(minV,maxV);
    }
    else if(pointLoc[0][in].y > height){
      pointVel[in].y = (-1*random(minV,maxV));
    }
  }
  
  void drawThing(){
    colorFader.update();
    noFill();
   
    //a drop shadow
    if(dropShadow){
      strokeWeight(3);
      stroke(0,200);
      for(int i = 0; i < numLines; i++){
        beginShape();
        for(int ii = 0; ii < numPoints; ii++){
          vertex(pointLoc[i][ii].x,pointLoc[i][ii].y);
        }
        endShape(CLOSE);
      }
    }
   
    strokeWeight(1);
    stroke(colorFader.getColor());
    //draw lines
    for(int i = 0; i < numLines; i++){
      beginShape();
      for(int ii = 0; ii < numPoints; ii++){
        vertex(pointLoc[i][ii].x,pointLoc[i][ii].y);
      }
      endShape(CLOSE);
    }
  }
}

class ColorFader{
  
  int[] vals = {0,0,0};
  color col;
  int ind = 1;
  int fadeSpeed = 1;
  
  public ColorFader(){
     float ran = random(0,1);
     if(ran < .33)
       vals[0] = 255;
     else if(ran > .66)
       vals[2] = 255;
     else
       vals[1] = 255;
     col = color(vals[0],vals[1],vals[2]);  
  } 
  
  void update(){
    if(vals[ind] < 255){
      vals[ind] += fadeSpeed;
      if(ind == 0)
        vals[2] -= fadeSpeed;
      
      else
        vals[ind-1] -= fadeSpeed;
    }
    else{
      ind++;
      if(ind > 2)
        ind = 0;
    }
    col = color(vals[0],vals[1],vals[2]);
  }
  
  color getColor(){
    return col; 
  }
  
}

//from mystify_5
