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
  analyser.smoothingTimeConstant = 0.55;
  analyser.fftSize = 256;
  dataArray.current = new Uint8Array(analyser.frequencyBinCount);
  source.start(fromTime);

  setInterval(() => {
    requestAnimationFrame(drawcb);
  }, 1000/40)
}

q5.drawBar = (analyser, dataArray, canvasCtx, width, height, volHistory) => {
  const bufferLength = analyser.frequencyBinCount;

  analyser.getByteFrequencyData(dataArray);
  canvasCtx.clearRect(0, 0, width, height);
  
  const barWidth = (width - bufferLength) / bufferLength;

  let barHeight;
  let x = 0;
  for (let i = 0; i < bufferLength; i++) {
    barHeight = calcBarHeight(dataArray[i], height);
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
  
  canvasCtx.beginPath()

  let a = ((Math.PI * 2)/365);

  for(let i = 0; i < volHistory.current.length; i++) {    
    let vol_i = volHistory.current[i];
    
    let r = _map(vol_i, 0, 255, Math.min(width, height) * 0.1, Math.min(width, height))
    
    let x = r * Math.cos(a*i) + width / 2;
    let y = r * Math.sin(a*i) + height / 2 ;
    canvasCtx.lineTo(x, y)
  }
}


q5.drawWave = (analyser, dataArray, canvasCtx, width, height, volHistory) => {
  analyser.getByteFrequencyData(dataArray);
  const vol = getAverageVolume(dataArray);
  volHistory.current.push(vol);
  if(volHistory.current.length > width) {
    volHistory.current.splice(0, 1)
  }
  canvasCtx.clearRect(0, 0, width, height);
  canvasCtx.strokeStyle = "#003300";
  canvasCtx.stroke();

  canvasCtx.beginPath()
  for(let i = 0; i < volHistory.current.length; i++) {
    let vol_i = volHistory.current[i];
    let y = _map(vol_i, 0, 255, height, height * 0.1 )
    canvasCtx.lineTo(i, y)
  }
}

export default q5;

