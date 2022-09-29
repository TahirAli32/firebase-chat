import '../styles/ChatHeader.scss'
// import pic from '../assets/pic.png'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { useContext } from 'react'
import MessagesContext from '../stores/messagesContext'

const ChatHeader = () => {

  const { data, dispatch } = useContext(MessagesContext)

  return (
    <div className='header'>
        <div className="chatUser">
            <img src={data.user?.photoURL} alt="img" className="userImg" />
            <span>{data.user?.displayName}</span>
        </div>
        <div className="settingIcon" onClick={()=>dispatch({type: "CHANGE_USER", payload: {}})}><AiOutlineCloseCircle /></div>
    </div>
  )
}

export default ChatHeader