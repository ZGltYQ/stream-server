import logo from './logo.svg';
import './App.css'
import { useRef, useState } from 'react'
import SimplePeerWrapper from 'simple-peer-wrapper/dist/simple-peer-wrapper';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// import { loadPlayer } from './Player/index'
import { JSMpeg } from './Player'

function App() {
  const canvas = useRef()
  function handleStart() {
    const spw = new SimplePeerWrapper({
      serverUrl: 'http://212.111.203.181:8081',
      debug: true,
      simplePeerOptions: {
        config : { iceServers: [
          { urls: 'stun:hisokajenkins.space:5349' }, 
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' }
        ] }
      }
    })

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
        console.log({ key })
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
      <Button variant="contained" onClick={handleStart}>start</Button>
      <canvas tabindex='1' className='videoBlock' ref={canvas}></canvas>
    </div>
  );
}

export default App;
