import axios from 'axios';

const calcBarHeight = (barHeight, height) => {
  const barHeightPercent = barHeight / 255;
  return Math.floor(barHeightPercent * height);
};

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

q5.drawWaveForm = (analyser, dataArray, canvasCtx, width, height) => {
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

export default q5;



