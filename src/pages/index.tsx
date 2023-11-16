import io from 'socket.io-client'
import { useState, useEffect } from 'react'

let socket: any = null

export default function Home() {
  const [timer, setTimer] = useState('0:00:000')
  const [result, setResult] = useState<Array<any>>([])

  const addResult = (time: string, line: string) => {
    setResult((currentResult) => [...currentResult, { time, line }])
  }

  const socketInitializer = async () => {
    if (socket) return
    socket = io()

    socket.on('timer', (timer: string) => {
      setTimer(timer)
    })

    socket.on('finish-time-a', (time: string) => {
      addResult(time, 'A')
    })

    socket.on('finish-time-b', (time: string) => {
      addResult(time, 'B')
    })

    socket.on('finish-time-c', (time: string) => {
      addResult(time, 'C')
    })
  }

  const handleReset = async () => {
    socket.emit('reset-timer')
  }

  useEffect(() => {
    socketInitializer()
  }, [])

  return (
    <main className="min-h-screen grid place-items-center">
      <div>
        <h1 className="mb-6 font-mono text-8xl text-center">{timer}</h1>

        <section className="grid grid-cols-3 gap-4 h-36">
          <div className="p-6 border">
            <h2 className="text-2xl text-center">A</h2>
          </div>
          <div className="p-6 border">
            <h2 className="text-2xl text-center">B</h2>
          </div>
          <div className="p-6 border">
            <h2 className="text-2xl text-center">C</h2>
          </div>
        </section>
      </div>
      {/* <h1 className="text text-center text-6xl">{timer}</h1>

      <button onClick={handleReset}>Reset</button>

      <br /> */}

      {/* {result.map((res, index) => (
        <p key={`result-${index}`}>
          {index + 1}: {res.time} - {res.line}
        </p>
      ))} */}
    </main>
  )
}
