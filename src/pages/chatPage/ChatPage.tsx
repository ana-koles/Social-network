import { useDispatch, useSelector } from 'react-redux'
import { ChatMessageDisplayType } from './chatApi'
import s from './ChatPage.module.css'
import { memo, useEffect, useRef, useState } from 'react'
import { sendMessageTC, startMessageListeningTC, stopMessageListingTC } from './chat-reducer'
import { selectChatStatus, selectMessages } from './chat-selectors'
import { AppDispatch } from '@/redux/redux-store'

const ChatPage = () => {
  return (
    <div className={s.content}>
      <Chat/>
    </div>
  )
}

const Chat = () => {
/*   const [wsChannel, setWsChannel] = useState<WebSocket | null>(null) */
  const dispatch: AppDispatch = useDispatch()
  const chatStatus = useSelector(selectChatStatus)

  useEffect(() => {
    dispatch(startMessageListeningTC())
    return () => dispatch(stopMessageListingTC())
  }, [dispatch])

/*   useEffect(() => { */
/*     let ws: WebSocket

    const onCloseChannelHandler = () => {
      console.log('Close ws')
      setTimeout(() => {
        createChannel()
      }, 3000)
    }

    const createChannel = () => {
      ws?.removeEventListener('close', onCloseChannelHandler)
      ws?.close()

      ws = new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx')
      ws.addEventListener('close', onCloseChannelHandler)
      setWsChannel(ws)
    }

    createChannel() */
/*   }, []) */

/*   useEffect(() => {
    const onCloseHandler = () => {
      console.log('Close ws')
    }
    wsChannel?.addEventListener('close', onCloseHandler)

    return () =>  wsChannel?.removeEventListener('close', onCloseHandler)
  }, [wsChannel])
 */
  return (
    <>
      {chatStatus === 'error' ? <div>Some error occuried. Please refresh the page</div>
        :
        <>
          <Messages/>
          <AddChatMessageForm/>
        </>
      }
    </>
  )
}

const Messages = () => {
  const messages = useSelector(selectMessages)
  const messageScrollRef = useRef<HTMLDivElement>(null)
  const [isAutoScroll, setIsAutoScroll] = useState(false)

  //when new messages come, scroll have to put to div ref
  useEffect(() => {
    if (isAutoScroll) {
      messageScrollRef.current?.scrollIntoView({behavior: 'smooth'})
    }
  }, [messages])

  const onScrollHanderl = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const element = e.currentTarget
    if (Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 100) {
      setIsAutoScroll(true)
    } else {
      setIsAutoScroll(false)
    }
  }
/*   const [messages, setMessages] = useState<ChatMessageType[]>([]) */

/*   useEffect(() => { */
/*     const onMessageHandler = (e: MessageEvent) => {
      const newMessages = JSON.parse(e.data)  */ //need to convert in JSON, because ws sends data in text and blob format
      /* setMessages(prevMessages => [...prevMessages, ...newMessages]) */ // receive messages through websocket -> set them in state
      // need to spread newMessages, because it is also an array
/*     } */

    //subscribe for message event of ws (synchronizing) when component mount
    // this event runs each time when server sends message through websocket
/*     wsChannel?.addEventListener('message', onMessageHandler)

    return () => wsChannel?.removeEventListener('message', onMessageHandler) */
/*   }, []) */

  return (
    <div style={{height: '400px', overflowY: 'auto'}} onScroll={onScrollHanderl}>
      {messages?.map((m) => <Message key={m.id} message={m}/>)}
      <div ref={messageScrollRef}></div>
    </div>
  )
}

type MessagePropsType = {
  message: ChatMessageDisplayType
}

const Message = memo(({message}: MessagePropsType) => {
  console.log('message')
  return (
    <div style={{marginBottom: '20px'}}>
      <img src={message.photo} alt={'avatar'} style={{height: '30px', width: '30px'}}/>
      <span>{message.userName}</span>
      <p>{message.message}</p>
    </div>
  )
})

const AddChatMessageForm = () => {
  const [message, setMessage] = useState('')
  const chatStatus = useSelector(selectChatStatus)
  const dispatch = useDispatch()
  const submitBtnRef = useRef<HTMLButtonElement>(null)
  const messageAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const currentMessageAreaRef =  messageAreaRef.current
    const keyPressHandler = (event: KeyboardEvent) => {
      if (currentMessageAreaRef && currentMessageAreaRef.value.length > 0) {
        if (event.key === "Enter") {
          event.preventDefault();
          submitBtnRef?.current?.click();
        }
      }
    }
    messageAreaRef.current?.addEventListener('keypress', keyPressHandler)


   /*  const onOpenHandler = () => { */ //subscribe for open event for ws
    /*    setChannelStatus('open')
    }

    wsChannel?.addEventListener('open', onOpenHandler)
    return () => wsChannel?.removeEventListener('open', onOpenHandler) */

    return () => currentMessageAreaRef?.removeEventListener('keypress', keyPressHandler)
  }, [])

  const onClickHandler = () => {
    if (!message) return
    dispatch(sendMessageTC(message))
    setMessage('')
  }

  const onChangeHanlder = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value)
  }

  return (
    <>
      <textarea onChange={e => onChangeHanlder(e)} value={message} ref={messageAreaRef}/>
      <button disabled={chatStatus === 'pending'} onClick={onClickHandler} ref={submitBtnRef}>send</button>
    </>
  )
}

export default ChatPage