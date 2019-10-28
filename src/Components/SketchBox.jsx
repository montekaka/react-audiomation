import React from 'react'
import Sketch from 'react-p5'

const SketchBox = (props) => {
  return (
    <Sketch 
      setup={(p5, canvasParentRef) => {
        p5.createCanvas(props.width, props.height).parent(canvasParentRef)
        p5.background(220, 141, 155, 60);                    
      }}
      draw={(p5) => {        
        if(Object.keys(props.amp).length > 0 && props.amp.getLevel() > 0) {
          p5.clear()          
          p5.background(220, 141, 155, 60);
          let vol = props.amp.getLevel();
          //Visualize.drawCircle(p5, vol, props.volHistory, props.width, props.height, props.setVolHistory);
          props.visualize(p5, vol, props.volHistory, props.width, props.height, props.setVolHistory)
        }              
      }}
      doubleClicked={(p5) => {
        p5.resizeCanvas(props.width, props.height)
        p5.background(220, 141, 155, 60);
      }}
    />
  )
}

export default SketchBox