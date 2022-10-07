import React, { useContext, useEffect, useState } from 'react'
import '../styles/Messenger.scss'
import Conversation from '../components/Conversation'
import Message from '../components/Message'
import ChatHeader from '../components/ChatHeader.jsx'
import AuthContext from '../stores/authContext'
import MessagesContext from '../stores/messagesContext'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { collection, updateDoc, doc, getDocs, query, setDoc, where, serverTimestamp, getDoc, onSnapshot, arrayUnion, Timestamp } from 'firebase/firestore'
import { v4 as uuid } from 'uuid'

const Messenger = () => {

    const navigate = useNavigate()

    const { currentUser } = useContext(AuthContext)
    const { data } = useContext(MessagesContext)

    // console.log(currentUser)

    const [username, setUsername] = useState("")
    const [user, setUser] = useState("")
    const [messages, setMessages] = useState([])
    const [text, setText] = useState("")

    
    useEffect(() => {
        if(currentUser)
        return
        navigate('/login')
    }, [navigate, currentUser])
    
    useEffect(()=>{
        const unsub = onSnapshot(doc(db, "chats", data.chatID), (doc) => {
            doc.exists() && setMessages(doc.data().messages)
        })
        return () => {
            unsub()
        }
    }, [data])

    const handleSend = async () => {
        if(!text.match(/([^\s])/)){
            return
        }
        try {
            await updateDoc(doc(db, "chats", data.chatID),{
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now()
                })
            })
            setText("")
            await updateDoc(doc(db,"userChats", currentUser.uid),{
                // [data.chatID+".lastMessage"]: text,
                [data.chatID+".date"]: serverTimestamp()
            })
            await updateDoc(doc(db,"userChats", data.user.uid),{
                // [data.chatID+".lastMessage"]: text,
                [data.chatID+".date"]: serverTimestamp()
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleSearch = async () => {
        setUser("")
        const q = query(
            collection(db, 'users'),
            where("displayName", "==", username),
            where("uid", "!=", currentUser.uid),
        )
        try{
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach( doc => {
                setUser(doc.data())
            })

            // const querySnapshot1 = await getDocs(collection(db, "users"));
            //     querySnapshot1.forEach((doc) => {
            //     console.log(doc.id, " => ", doc.data())
            // })

        }catch(error){
            console.log(error.message)
        }
    }

    const handleSelect = async () => {
        const combinedID = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid
        try {
            const res = await getDoc(doc(db, "chats", combinedID))
            if(!res.exists()){
                await setDoc(doc(db, "chats", combinedID), { messages: [] })
                await updateDoc(doc(db, "userChats", currentUser.uid),{
                    [combinedID + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [combinedID + ".date"]: serverTimestamp()
                })
                await updateDoc(doc(db, "userChats", user.uid),{
                    [combinedID + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    },
                    [combinedID + ".date"]: serverTimestamp()
                })
            }
        } catch (error) {
            console.log(error);
        }
        setUser("")
        setUsername("")
    }

    return (
        <div className='messenger'>
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <div className="chatMenuTop">
                        <div className='header'>
                            <div className="currentUser">
                                <img src={currentUser ? currentUser.photoURL : undefined} alt="img" className="currentUserImg" />
                                <span>{currentUser && currentUser.displayName}</span>
                            </div>
                        </div>
                        <input type="text" className='chatMenuInput' value={username} onKeyDown={e => e.code === "Enter" && handleSearch()} onChange={e => setUsername(e.target.value)} placeholder='Search Friends Name' />
                        {user &&
                            <div className='searchUser' onClick={() => handleSelect()}>
                                <img src={user.photoURL} alt="img" className="searchUserImg" />
                                <span className='searchUserName'>{user.displayName}</span>
                            </div>
                        }
                        <Conversation />
                    </div>
                    <div className="chatMenuBottom">
                        <div className="logoutBtn" onClick={() => signOut(auth)}>Logout</div>
                    </div>
                </div>
            </div>
            <div className="chatBox">
                {data.user.uid && 
                    <div className="chatBoxWrapper">
                        <ChatHeader />
                        <div className="chatBoxTop">
                            {messages?.map( m => (
                                <Message
                                    key={m.id}
                                    message={m.text}
                                    own={m.senderId === currentUser?.uid ? true : false} 
                                    sentAt={m.date.seconds}
                                />
                            ))}
                        </div>
                        <div className="chatBoxBottom">
                            <textarea placeholder="Write Message" value={text} onKeyDown={e => e.code === "Enter" && handleSend()} onChange={ e => setText(e.target.value)} className='chatMessageInput'/>
                            <button className='chatSubmitButton' onClick={ ()=> handleSend()}>Send</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Messenger