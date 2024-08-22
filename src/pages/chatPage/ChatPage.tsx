import s from './ChatPage.module.css'
import { useEffect, useState } from 'react'

export type ChatMessageType = {
  message: string
  photo: string
  userId: number
  userName: string
}

const wsChannel = new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx') // create connection with this url

const ChatPage = () => {
  return (
    <div className={s.content}>
      <Chat/>
    </div>
  )
}

const Chat = () => {
  return (
    <>
      <Messages/>
      <AddChatMessageForm/>
    </>
  )
}

const Messages = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([])

  useEffect(() => {
    //subscribe for message event of ws (synchronizing) when component mount
    // this event runs each time when server sends message through websocket
    wsChannel.addEventListener('message', (e: MessageEvent) => {
      console.log(JSON.parse(e.data))
      const newMessages = JSON.parse(e.data)  //need to convert in JSON, because ws sends data in text and blob format
      setMessages(prevMessages => [...prevMessages, ...newMessages]) // receive messages through websocket -> set them in state
                                                  // need to spread newMessages, because it is also an array
    })
  }, [])

  return (
    <div style={{height: '400px', overflowY: 'auto'}}>
      {messages.map((m, index) => <Message key={index} message={m}/>)}
    </div>
  )
}

type MessagePropsType = {
  message: ChatMessageType
}

const Message = ({message}: MessagePropsType) => {

  return (
    <div style={{marginBottom: '20px'}}>
      <img src={message.photo} alt={'avatar'} style={{height: '30px', width: '30px'}}/>
      <span>{message.userName}</span>
      <p>{message.message}</p>
    </div>
  )
}

const AddChatMessageForm = () => {
  const [message, setMessage] = useState('')
  const [channelStatus, setChannelStatus] = useState<'pending' | 'open'>('pending')

  useEffect(() => {
    wsChannel.addEventListener('open', () => { //subscribe for open event for ws
      setChannelStatus('open')
    })
    return () => {setChannelStatus('pending')}
  }, [])

  const sendMessage = () => {
    if (!message) return
    wsChannel.send(message)
    setMessage('')
  }

  const onChangeHanlder = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value)
  }

  return (
    <>
      <textarea onChange={e => onChangeHanlder(e)} value={message}/>
      <button disabled={channelStatus === 'pending'} onClick={sendMessage}>send</button>
    </>
  )
}

export default ChatPage