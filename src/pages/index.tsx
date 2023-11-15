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

  // const sendMessage = async () => {
  //   socket.emit('createdMessage', { author: chosenUsername, message })
  //   setMessages((currentMsg) => [
  //     ...currentMsg,
  //     { author: chosenUsername, message },
  //   ])
  //   setMessage('')
  // }

  useEffect(() => {
    socketInitializer()
  }, [])

  return (
    <main className="grid place-content-center min-h-screen">
      <h1 className="text text-center text-6xl">{timer}</h1>

      <br />

      {result.map((res, index) => (
        <p key={`result-${index}`}>
          {index + 1}: {res.time} - {res.line}
        </p>
      ))}
    </main>
  )
}
