import React, {useState, useEffect} from 'react'
import {Rnd} from 'react-rnd';
import Sketch from 'react-p5'
import p5 from "p5";
import "p5/lib/addons/p5.sound";
import Visualize from '../libs/visualizer'
import SketchBox from './SketchBox';

const AddFile = (props) => {
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

// TODO: show rulers
const P5Component = () => {
  const url = '/tmp/demo.mp3'

  const [canvas, setCanvas] = useState({x: 100, y: 100, width: 100, height: 60})
  const [song, setSong] = useState({});
  const [volHistory, setVolHistory] = useState([]);
  const [amp, setAmp] = useState([]);

  const dndHandler = (e, d) => {
    // TODO: update the new x, y to context
    setCanvas({...canvas, x: d.x, y: d.y})
    //console.log({x: d.x, y: d.y})
  }

  const reiszeHander = (e, direction, ref, delat, position) => {
    setCanvas({...canvas, width: parseFloat(ref.style.width), height: parseFloat(ref.style.height)})
    // console.log({      
    //   width: parseFloat(ref.style.width), 
    //   height: parseFloat(ref.style.height),
    //   ...position
    // })
  }

  return (
    <div>
      <div className="video-frame" 
        style={{"height": "400px", "width": "400px", "backgroundColor": "blanchedalmond"}}
      >  
        <Rnd 
          default={{
            x: canvas.x,
            y: canvas.y,
            width: canvas.width,
            height: canvas.height
          }}
          onDragStop={(e, d) => {
            dndHandler(e, d);
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            reiszeHander(e, direction, ref, delta, position)
          }}
          bounds="parent"
          style={{backgroundColor: 'rgba(52, 52, 52, 0.3)'}}
          //style={{borderStyle: 'solid'}}
        >
          <SketchBox width={canvas.width} 
            height={canvas.height} 
            x={canvas.x} 
            y={canvas.y}
            amp={amp}
            volHistory={volHistory}
            setVolHistory={setVolHistory}
            visualize={Visualize.drawCircle}
          />
        </Rnd>       
      </div>
      <AddFile 
        url={url}
        setAmp={setAmp}
        song={song}
        setSong={setSong}      
      />
    </div>
  )
}

export default P5Component;
