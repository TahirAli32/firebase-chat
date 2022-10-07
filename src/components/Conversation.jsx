import { useState, useEffect, useContext } from 'react'
import '../styles/Conversation.scss'
import { db } from '../firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import AuthContext from '../stores/authContext'
import MessagesContext from '../stores/messagesContext'

const Conversation = () => {

  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(MessagesContext)

  const [chats, setChats] = useState([])

  useEffect(()=>{
    const getMessages = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data())
      })
      return () => {
        unsub()
      }
    }
    currentUser?.uid && getMessages()
  }, [currentUser])

  const handleSelect = (u) => {
    dispatch({type: "CHANGE_USER", payload: u})
  }

  return (
    <div className='conversation'>
      {Object.entries(chats)?.sort((a,b)=>b[1].date-a[1].date).map( chat => (
        <div key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
          <img src={chat[1].userInfo.photoURL} alt="img" className="conversationImg" />
          <div className='coversationData'>
            <span className='conversationName'>{chat[1].userInfo.displayName}</span>
            {/* <span className='lastMessage'>{chat[1].lastMessage.slice(0, 20) + '...'}</span> */}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Conversation