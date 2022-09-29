import '../styles/Message.scss'
import { format } from 'timeago.js'
import { useEffect, useRef } from 'react'

const Message = ({own, message, sentAt}) => {

  const ref = useRef()

  useEffect(() => {
    ref.current?.scrollIntoView({behaviour: "smooth"})
  }, [message])

  return (
    <div ref={ref} className={own ? 'message own' : 'message'}>
      <div className={own ? "messageTop reverse" :"messageTop"}>
          <p className='messageText'>{message}</p>
      </div>
      <div className="messageBottom">
          {format(sentAt*1000)}
      </div>
    </div>
  )
}

export default Message