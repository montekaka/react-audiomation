import p5 from 'p5';
let song;

const preload = () => {
  const url = 'http://download.randgad.com/shows/2019.10.12_RandGad_ep477.mp3';
  song = loadSound(url)
}


class Visualizer {
  constructor(audio) {
    this.audio = audio;
    this.fromTime = 0;
    this.endTime = 0;
    this.x = 0;
    this.y = 0;    
    this.width = 0;
    this.height = 0;
  }

  play() {

  }
}

export default Visualizer;