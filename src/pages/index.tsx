import io from 'socket.io-client'
import { useState, useEffect } from 'react'

let socket: any = null

export default function Home() {
  const [timer, setTimer] = useState('0:00:000')
  const [lapA, setLapA] = useState<Array<string>>([])
  const [lapB, setLapB] = useState<Array<string>>([])
  const [lapC, setLapC] = useState<Array<string>>([])
  const [lastLap, setLastLap] = useState('')

  const socketInitializer = async () => {
    if (socket) return
    socket = io()

    socket.on('stopwatchTime', (time: string) => {
      setTimer(time)
    })

    socket.on('lapA', (time: string) => {
      setLapA((currentLap) => [...currentLap, time])
      setLastLap(`A: ${time}`)
    })

    socket.on('lapB', (time: string) => {
      setLapB((currentLap) => [...currentLap, time])
      setLastLap(`B: ${time}`)
    })

    socket.on('lapC', (time: string) => {
      setLapC((currentLap) => [...currentLap, time])
      setLastLap(`C: ${time}`)
    })

    socket.on('galleryRoom', (data: any) => {
      console.log('masuk')
    })
  }

  const sendMessage = async () => {
    socket.emit('galleryRoom', ['test', 'test'])
    console.log('test')
    // setMessages((currentMsg) => [
    //   ...currentMsg,
    //   { author: chosenUsername, message },
    // ])
    // setMessage('')
  }

  useEffect(() => {
    socketInitializer()
  }, [])

  return (
    <main className="grid place-content-center min-h-screen">
      <h1 className="text text-center text-6xl" onClick={sendMessage}>
        {timer}
      </h1>

      <br />

      <div className="flex gap-14 justify-center h-32 text-center">
        <div className="w-20">
          <h2>Lap A</h2>
          {lapA.map((lap, index) => (
            <p key={`lapA-${index}`}>{lap}</p>
          ))}
        </div>
        <div className="w-20">
          <h2>Lap B</h2>
          {lapB.map((lap, index) => (
            <p key={`lapB-${index}`}>{lap}</p>
          ))}
        </div>
        <div className="w-20">
          <h2>Lap C</h2>
          {lapC.map((lap, index) => (
            <p key={`lapC-${index}`}>{lap}</p>
          ))}
        </div>
      </div>

      <div className="h-40">
        {lapA.length >= 3 && lapB.length >= 3 && lapC.length >= 3 && (
          <>
            <h1 className="text-center text-7xl">{lastLap}</h1>
            <h2 className="text-center text-7xl">
              Lambat kayak situs pemerentah
            </h2>
          </>
        )}
      </div>
    </main>
  )
}
