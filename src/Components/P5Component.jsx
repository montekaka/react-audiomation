import React, {useState, useEffect} from 'react'
import {Rnd} from 'react-rnd';
import Sketch from 'react-p5'
import p5 from "p5";
import "p5/lib/addons/p5.sound";

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

const Box = (props) => {
  return (
    <Sketch 
      setup={(p5, canvasParentRef) => {
        p5.createCanvas(props.width, props.height).parent(canvasParentRef)
      }}
      draw={(p5) => {
        p5.background(0);        
        // p5.point(0, props.height);        
        if(Object.keys(props.amp).length > 0 && props.amp.getLevel() > 0) {
          let vol = props.amp.getLevel();          
          props.setVolHistory([...props.volHistory, vol])            
          p5.stroke('purple')
          p5.strokeWeight(2)
          p5.noFill();          
          p5.beginShape();                  
            for (var i = 0; i < props.volHistory.length; i++) {          
              let y = p5.map(props.volHistory[i], 0, 1, props.height, 0)
              // console.log(props.x + i, y)
              // p5.point(i, y);            
              p5.vertex(i, y)
            }          
          p5.endShape();
          if(props.volHistory.length > props.width) {
            let volHistory = props.volHistory
            volHistory.splice(0, 1);
            props.setVolHistory(volHistory)
          }
        }              
        // p5.ellipse(100, 100, vol * 50);
      }}
      doubleClicked={(p5) => {
        p5.resizeCanvas(props.width, props.height)
      }}
    />
  )
}

// TODO: show rulers
const P5Component = () => {
  const url = '/tmp/demo.mp3'

  const [canvas, setCanvas] = useState({x: 100, y: 300, width: 200, height: 200})
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
      <div className="video-frame">  
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
          style={{backgroundColor: 'white'}}
        >
          <Box width={canvas.width} 
            height={canvas.height} 
            x={canvas.x} 
            y={canvas.y}
            amp={amp}
            volHistory={volHistory}
            setVolHistory={setVolHistory}
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
