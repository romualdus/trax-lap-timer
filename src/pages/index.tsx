import io from 'socket.io-client'
import { useState, useEffect } from 'react'

let socket: any = null

type Message = {
  author: string
  message: string
}

export default function Home() {
  const [username, setUsername] = useState('')
  const [chosenUsername, setChosenUsername] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<Message>>([])

  const socketInitializer = async () => {
    if (socket) return
    socket = io()

    socket.on('newIncomingMessage', (msg: Message) => {
      setMessages((currentMsg) => [
        ...currentMsg,
        { author: msg.author, message: msg.message },
      ])
      console.log('incoming message', messages)
    })
  }

  const sendMessage = async () => {
    console.log('sending message')
    socket.emit('createdMessage', { author: chosenUsername, message })
    setMessages((currentMsg) => [
      ...currentMsg,
      { author: chosenUsername, message },
    ])
    setMessage('')
  }

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      if (message) {
        sendMessage()
      }
    }
  }

  useEffect(() => {
    socketInitializer()
  }, [])

  return (
    <div className="flex items-center p-4 mx-auto min-h-screen justify-center bg-purple-500">
      <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
        {!chosenUsername ? (
          <>
            <h3 className="font-bold text-white text-xl">
              How people should call you?
            </h3>
            <input
              type="text"
              placeholder="Identity..."
              value={username}
              className="p-3 rounded-md outline-none text-black"
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={() => {
                setChosenUsername(username)
              }}
              className="bg-white rounded-md px-4 py-2 text-xl text-black"
            >
              Go!
            </button>
          </>
        ) : (
          <>
            <p className="font-bold text-white text-xl">
              Your username: {username}
            </p>
            <div className="flex flex-col justify-end bg-white h-[20rem] min-w-[33%] rounded-md shadow-md ">
              <div className="h-full last:border-b-0 overflow-y-scroll">
                {messages.map((msg, i) => {
                  return (
                    <div
                      className="w-full py-1 px-2 border-b border-gray-200 text-black"
                      key={i}
                    >
                      {msg.author} : {msg.message}
                    </div>
                  )
                })}
              </div>
              <div className="border-t border-gray-300 w-full flex rounded-bl-md">
                <input
                  type="text"
                  placeholder="New message..."
                  value={message}
                  className="outline-none py-2 px-2 rounded-bl-md flex-1 text-black"
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyUp={handleKeypress}
                />
                <div className="border-l border-gray-300 flex justify-center items-center  rounded-br-md group hover:bg-purple-500 transition-all">
                  <button
                    className="group-hover:text-white px-3 h-full text-black"
                    onClick={() => {
                      sendMessage()
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
