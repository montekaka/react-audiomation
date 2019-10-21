import axios from 'axios';
import p5 from "p5";
import "p5/lib/addons/p5.sound";

class q5 {
  constructor(url) {
    this.url = url;
    // this.song = {};
  }

  init() {
    const song = new p5.SoundFile(this.url, () => {
      console.log('loaded')
      this.song = song;
      song.play();
      this.amp = new p5.Amplitude();
    }, () => {

    }, (a) => {
      // TODO: show loading percentage
      console.log(a)
    });    
  }

  draw() {
    
  }
}

export default q5;



