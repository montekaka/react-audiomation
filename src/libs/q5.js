import axios from 'axios';

const calcBarHeight = (barHeight, height) => {
  const barHeightPercent = barHeight / 255;
  return Math.floor(barHeightPercent * height);
};

const getAverageVolume = (array) => {
  var values = 0;
  var average;

  var length = array.length;

  // get all the frequency amplitudes
  for (var i = 0; i < length; i++) {
      values += array[i];
      if(array[i] < 0 ) {
      }
  }

  average = values / length;
  return average;  
}

const _map = (n, start1, stop1, start2, stop2) => {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}

const q5 = {}

q5.loadSound = (audioCtx, url) => {
  return axios({url: url, responseType: "arraybuffer"})
  .then((res) => {
    const audioData = res.data;
    return audioCtx.decodeAudioData(audioData)
  })
}

q5.play = (source, analyser, dataArray, fromTime, drawcb) => {
  analyser.minDecibels = -90;
  analyser.maxDecibels  = -10;
  analyser.smoothingTimeConstant = 0.85;
  analyser.fftSize = 256;
  dataArray.current = new Uint8Array(analyser.frequencyBinCount);
  source.start(fromTime);
  
  setInterval(() => {
    requestAnimationFrame(drawcb);
  }, 1000/40)
}

q5.drawWaveForm = (analyser, dataArray, canvasCtx, width, height, volHistory) => {
  const bufferLength = analyser.frequencyBinCount;

  analyser.getByteFrequencyData(dataArray);
  canvasCtx.clearRect(0, 0, width, height);
  
  const barWidth = (width - bufferLength) / bufferLength;

  let barHeight;
  let x = 0;
  for (let i = 0; i < bufferLength; i++) {
    barHeight = calcBarHeight(dataArray[i], height);
    //console.log(_height - barHeight)
    canvasCtx.fillStyle = "rgb(255, 87, 51)";
    canvasCtx.fillRect(x, height-barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }  
}

q5.drawCircle = (analyser, dataArray, canvasCtx, width, height, volHistory) => {  
  
  
  analyser.getByteFrequencyData(dataArray);

  const vol = getAverageVolume(dataArray);

  volHistory.current.push(vol);
  if(volHistory.current.length > 360) {
    volHistory.current.splice(0, 1)
  }

  canvasCtx.clearRect(0, 0, width, height);  
  canvasCtx.strokeStyle = "#003300";
  canvasCtx.stroke();

  //console.log(volHistory.current.length)
  // analyser.getByteFrequencyData(dataArray);
  // canvasCtx.clearRect(0, 0, width, height);
  

  canvasCtx.beginPath()
  //canvasCtx.moveTo(width/2, height/2);
  let a = ((Math.PI * 2)/365);
  //canvasCtx.translate(width/2, height/2)
  //canvasCtx.moveTo(0,0);

  for(let i = 0; i < volHistory.current.length; i++) {    
    let vol_i = volHistory.current[i];
    
    let r = _map(vol_i, 0, 255, Math.min(width, height) * 0.1, Math.min(width, height))
    
    let x = r * Math.cos(a*i) + width / 2;
    let y = r * Math.sin(a*i) + height / 2 ;
    canvasCtx.lineTo(x, y)
  }
  //canvasCtx.arc(width/2, height/2, vol, 0, 2 * Math.PI, false)
  //canvasCtx.closePath()
    
}

export default q5;



// Visualizer.drawCircle = (p5, vol, volHistory, width, height, setVolHistory) => {
  
//   p5.angleMode(p5.DEGREES)
//   //setVolHistory([...volHistory, vol])
//   volHistory.push(vol);
//   setVolHistory(volHistory)
//   p5.stroke(123)
//   p5.strokeWeight(2)
//   p5.noFill();
//   p5.translate(width/2, height/2);
  
//   p5.beginShape();       
//   for (var i = 0; i < 360; i++) {          
//     let vol_i = volHistory[i] ? volHistory[i] : 0;
//     let r = p5.map(vol_i, 0, 1, Math.min(width, height) * 0.1, Math.min(width, height));            
//     let x = r * p5.cos(i);
//     let y = r * p5.sin(i);
//     p5.vertex(x, y)
//   }          
//   p5.endShape();

//   if(volHistory.length > 360) {
//     volHistory.splice(0, 1);
//     setVolHistory(volHistory)
//   }
// }