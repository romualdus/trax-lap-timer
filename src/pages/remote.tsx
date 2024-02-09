import io from 'socket.io-client'
import { useState, useEffect } from 'react'
import cx from 'classnames'

let socket: any = null

export default function Remote() {
  const [timer, setTimer] = useState('0:00:020')
  const [resultA, setResultA] = useState({ position: 2, time: '0:12:233' })
  const [resultB, setResultB] = useState({ position: 1, time: '0:12:233' })
  const [resultC, setResultC] = useState({ position: 3, time: '0:12:233' })
  const [isFinal, setIsFinal] = useState<boolean>(false)
  const [position, setPositions] = useState<number>(1)

  const [scoreA, setScoreA] = useState<number>(0)

  const socketInitializer = async () => {
    if (socket) return
    socket = io()

    socket.on('timer', (timer: string) => {
      setTimer(timer)
    })

    socket.on('finish-time-a', (time: string) => {
      setResultA({ position, time })
      setPositions(position + 1)
    })

    socket.on('finish-time-b', (time: string) => {
      setResultB({ position, time })
      setPositions(position + 1)
    })

    socket.on('finish-time-c', (time: string) => {
      setResultC({ position, time })
      setPositions(position + 1)
    })

    // socket.on('reset-timer', () => {
    //   alert('reset')
    // })

    socket.on('scoreA', (score: number) => {
      setScoreA(score)
    })
  }

  const handleReset = async () => {
    socket.emit('reset-timer')

    setTimeout(() => {
      setTimer('0:00:000')
      setIsFinal(false)
      setPositions(1)
    }, 100)
  }

  const handleFinal = async () => {
    if (isFinal) return

    socket.emit('final-timer')
    setIsFinal(true)
  }

  useEffect(() => {
    socketInitializer()

    window.addEventListener('keydown', (event) => {
      if (event.key === ' ' || event.key === 'Spacebar') {
        if (!isFinal) {
          handleFinal()
        } else {
          handleReset()
        }
      }

      if (event.key === 'r') {
        handleReset()
      }
    })
  }, [])

  return (
    <main className="relative min-h-screen grid place-items-center">
      <h1>{scoreA}</h1>
      <section className="absolute top-5 right-5 flex justify-center gap-4 mb-6">
        <button
          className="py-2 px-3 border"
          onClick={() => socket.emit('scoreA')}
        >
          Add
        </button>
        <button className="py-2 px-3 border" onClick={handleReset}>
          Reset
        </button>
        <button className="py-2 px-3 border" onClick={handleFinal}>
          Final
        </button>
      </section>
    </main>
  )
}
