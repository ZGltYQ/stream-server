import './App.scss'
import React, { useRef, useState } from 'react'
import SimplePeerWrapper from 'simple-peer-wrapper/dist/simple-peer-wrapper';
import Button from '@mui/material/Button';
import { JSMpeg } from './Player'

function App() {
  const canvas = useRef();
  
  const [ isRecording, setIsRecording ] = useState(false);
  const [ session, setSession ] = useState();

  function handleClose() {
    setIsRecording(false);
    session.close();
  }

  function handleStart() {
    const spw = new SimplePeerWrapper({
    serverUrl: 'http://hisokajenkins.space:8081',
    debug: true,
    simplePeerOptions: {
        config : { 
            iceServers: [
            { urls: 'stun:hisokajenkins.space:5349' },
            { urls: 'stun:hisokajenkins.space:3478' }
          ] 
        }
      }
    })

    setSession(spw);
    setIsRecording(true);
    
    spw.connect();

    const player = new JSMpeg.Player('pipe', {
      canvas: canvas.current
    });

    canvas.current.requestFullscreen()

    spw.on("connect", () => {
      canvas.current.addEventListener('mousemove', ({ pageX, pageY }) => {
        if (spw.isConnectionStarted()) spw.send({ type: 'move', x: pageX, y: pageY })
      });

      canvas.current.addEventListener('keydown', ({ key }) => {
        if (spw.isConnectionStarted()) spw.send({ type: 'tap', key })
      })

      canvas.current.addEventListener('click', () => {
        if (spw.isConnectionStarted()) spw.send({ type: 'click' })
      })

      spw.on("data", ({ data }) => player.write(new Uint8Array(data?.data)));
    }) 
  }

  return (
    <div className="App">
      <Button 
        variant = "contained"
        {...isRecording ? { onClick: handleClose } : { onClick: handleStart }}
      >
        {isRecording ? 'stop' : 'start'}
      </Button>
      <canvas tabIndex={1} className='videoBlock' ref={canvas}></canvas>
    </div>
  );
}

export default App;
