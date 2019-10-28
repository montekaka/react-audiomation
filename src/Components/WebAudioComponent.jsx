import React, {useState, useEffect, useRef} from 'react'
import {Rnd} from 'react-rnd';
import q5 from './../libs/q5'
import { userInfo } from 'os';

const WebAudioComponent = () => {
  const url = '/tmp/demo.mp3'
    
  const [dndArea, setDndArea] = useState({x: 100, y: 100, width: 100, height: 60})
  const [song, setSong] = useState(null);
  //const [volHistory, setVolHistory] = useState([]);

  const audioCtx = useRef(new AudioContext());
  const analyser = useRef(audioCtx.current.createAnalyser());  
  const dataArray = useRef();
  const source = useRef();
  const canvas = useRef(null);
  const canvasCtx = useRef();
  const volHistory = useRef([]);

  // setup canvas
  useEffect(() => {
    canvasCtx.current = canvas.current.getContext('2d')
  }, [])

  const handleImportClicked = () => {
    q5.loadSound(audioCtx.current, url)
    .then((decodedData) => {
      source.current = audioCtx.current.createBufferSource();
      source.current.buffer = decodedData;
      source.current.connect(analyser.current);
      analyser.current.connect(audioCtx.current.destination);
      return;
    })
    .then(() => {
      q5.play(source.current, analyser.current, dataArray, 0, () => {
        //console.log('hello')
        q5.drawWave(analyser.current, dataArray.current, canvasCtx.current, dndArea.width, dndArea.height, volHistory)
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const dndHandler = (e, d) => {
    // TODO: update the new x, y to context
    setDndArea({...dndArea, x: d.x, y: d.y})
    //console.log({x: d.x, y: d.y})
  }

  const reiszeHander = (e, direction, ref, delat, position) => {
    setDndArea({...dndArea, width: parseFloat(ref.style.width), height: parseFloat(ref.style.height)})
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
            x: dndArea.x,
            y: dndArea.y,
            width: dndArea.width,
            height: dndArea.height
          }}
          onDrag={(e, d) => {
            dndHandler(e, d);
          }}
          onResize={(e, direction, ref, delta, position) => {
            reiszeHander(e, direction, ref, delta, position)
          }}
          bounds="parent"
          style={{backgroundColor: 'rgba(52, 52, 52, 0.3)'}}
          //style={{borderStyle: 'solid'}}  
        >
          <canvas
            ref={canvas}
            width={dndArea.width}
            height={dndArea.height}
          />
        </Rnd>          
      </div>
      <div>{dndArea.x}, {dndArea.y}, {dndArea.width}, {dndArea.height}</div>
      <div onClick={() => {
        handleImportClicked()
      }}>Click</div>
    </div>
  )
}

export default WebAudioComponent;