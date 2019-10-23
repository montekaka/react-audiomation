import React, {useState, useEffect} from 'react'
import {Rnd} from 'react-rnd';
import p5 from "p5";
import "p5/lib/addons/p5.sound";
import Visualize from '../libs/visualizer'
import SketchBox from './SketchBox';
import MediaControl from './MediaControl'

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
      <MediaControl 
        url={url}
        setAmp={setAmp}
        song={song}
        setSong={setSong}      
      />
    </div>
  )
}

export default P5Component;
