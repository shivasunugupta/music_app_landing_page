import React, { useContext } from 'react'
import Sidebar from './componenets/Sidebar'
import Player from './componenets/Player'
import Display from './componenets/Display'
import { PlayerContext } from './context/PlayerContext'


const App = () => {

  const{audioRef,track} = useContext(PlayerContext);

  return (
    <div className='h-screen bg-black'  >
      <div className='h-[90%] flex' >
        <Sidebar/>
        <Display/>
      </div>
      <Player/>
      <audio ref={audioRef} src={track.file} preload='auto'></audio>

    </div>
  )
}

export default App
