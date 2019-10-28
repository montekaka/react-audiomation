const Visualizer = {}

Visualizer.drawWave = (p5, vol, volHistory, width, height, setVolHistory) => {
  p5.angleMode(p5.RADIUS)  
  p5.stroke(123)
  p5.strokeWeight(2)
  volHistory.push(vol);
  p5.noFill();
  p5.beginShape();  
  for (var i = 0; i < volHistory.length; i++) {          
    let y = p5.map(volHistory[i], 0, 1, height, 0) - height * 0.3;
    p5.vertex(i, y)
  }          
  p5.endShape();
  //setVolHistory([...volHistory, vol])
  if(volHistory.length > width) {    
    volHistory.splice(0, 1);    
  }
  setVolHistory(volHistory);
}

Visualizer.drawCircle = (p5, vol, volHistory, width, height, setVolHistory) => {
  
  p5.angleMode(p5.DEGREES)
  //setVolHistory([...volHistory, vol])
  volHistory.push(vol);
  setVolHistory(volHistory)
  p5.stroke(123)
  p5.strokeWeight(2)
  p5.noFill();
  p5.translate(width/2, height/2);
  
  p5.beginShape();       
  for (var i = 0; i < 360; i++) {          
    let vol_i = volHistory[i] ? volHistory[i] : 0;
    let r = p5.map(vol_i, 0, 1, Math.min(width, height) * 0.1, Math.min(width, height));            
    let x = r * p5.cos(i);
    let y = r * p5.sin(i);
    p5.vertex(x, y)
  }          
  p5.endShape();

  if(volHistory.length > 360) {
    volHistory.splice(0, 1);
    setVolHistory(volHistory)
  }
}

export default Visualizer;