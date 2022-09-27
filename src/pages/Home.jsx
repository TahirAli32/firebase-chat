import { useEffect, useContext } from 'react'
import '../styles/Home.scss'
import AuthContext from '../stores/authContext'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

const Home = () => {
  
  const navigate = useNavigate()
  
  const authContext = useContext(AuthContext)
  let { currentUser } = authContext

  useEffect(() => {
    if(currentUser){
      console.log(currentUser)
      return
    }
    navigate('/login')
  }, [navigate, currentUser])

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/login')
  }

  return (
    <div className='main'>
      <h2 style={{cursor: 'pointer', margin: '25px'}} onClick={async () => handleLogout()}>Signout</h2>
      <span>{currentUser && currentUser.displayName}</span>
      <span>{currentUser && currentUser.email}</span>
    </div>
  )
}

export default Home