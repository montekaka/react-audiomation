import React, {useState} from 'react'
import p5 from "p5";
import "p5/lib/addons/p5.sound";

const MediaControl = (props) => {
  const [buttonLabel, setButtonLabel] = useState('Add')
  const [playButtonLabel, setPlayButtonLabel] = useState('Pause')

  const handleClick = () => {
    const song = new p5.SoundFile(props.url, () => {
      console.log('loaded')      
      song.play();
      props.setSong(song);
      setButtonLabel('Added')
      let amp = new p5.Amplitude();
      props.setAmp(amp);
    }, () => {

    }, (a) => {
      // TODO: show loading percentage
      console.log(a)
    }); 
  }

  const handleToggleClick = () => {
    if(props.song.isPlaying()) {
      console.log('puase')
      props.song.pause();
      setPlayButtonLabel('Play')
    } else {
      console.log('Play')
      props.song.play();
      setPlayButtonLabel('Pause')
    }    
  }

  return (
    <div>
      <div onClick={() => {
        handleClick();
      }}>{buttonLabel}</div>
      <div onClick={() => {
        handleToggleClick();
      }}>
        {playButtonLabel}
      </div>
    </div>
  )
}


export default MediaControl;