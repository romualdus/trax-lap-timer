import io from 'socket.io-client'
import { useState, useEffect } from 'react'

let socket: any = null

export default function Home() {
  const [timer, setTimer] = useState('0:00:000')
  const [resultA, setResultA] = useState<string>('')
  const [resultB, setResultB] = useState<string>('')
  const [resultC, setResultC] = useState<string>('')
  const [isFinal, setIsFinal] = useState<boolean>(false)

  const socketInitializer = async () => {
    if (socket) return
    socket = io()

    socket.on('timer', (timer: string) => {
      setTimer(timer)
    })

    socket.on('finish-time-a', (time: string) => {
      setResultA(time)
    })

    socket.on('finish-time-b', (time: string) => {
      setResultB(time)
    })

    socket.on('finish-time-c', (time: string) => {
      setResultC(time)
    })
  }

  const handleReset = async () => {
    socket.emit('reset-timer')

    setTimeout(() => {
      setTimer('0:00:000')
      setIsFinal(false)
    }, 100)
  }

  const handleFinal = async () => {
    socket.emit('final-timer')
    setIsFinal(true)
  }

  useEffect(() => {
    socketInitializer()

    window.addEventListener('keydown', (event) => {
      if (event.key === ' ' || event.key === 'Spacebar') {
        if (!isFinal) {
          console.log('spacebar')
          handleFinal()
        } else {
          console.log('spacebar 2')
          handleReset()
        }
      }

      if (event.key === 'r') {
        handleReset()
      }
    })
  }, [])

  return (
    <main className="min-h-screen grid place-items-center">
      <div>
        <h1 className="mb-6 font-mono text-8xl text-center">{timer}</h1>

        <section className="flex justify-center gap-4 mb-6">
          <button className="py-2 px-3 border" onClick={handleReset}>
            Reset
          </button>
          <button className="py-2 px-3 border" onClick={handleFinal}>
            Final
          </button>
        </section>

        <section className="grid grid-cols-3 gap-4 h-36">
          <div className="p-6 border">
            <h2 className="text-2xl text-center">A</h2>
            <p className="font-mono">{resultA}</p>
          </div>
          <div className="p-6 border">
            <h2 className="text-2xl text-center">B</h2>
            <p className="font-mono">{resultB}</p>
          </div>
          <div className="p-6 border">
            <h2 className="text-2xl text-center">C</h2>
            <p className="font-mono">{resultC}</p>
          </div>
        </section>
      </div>
    </main>
  )
}
