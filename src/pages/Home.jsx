import { useEffect, useContext } from 'react'
import '../styles/Home.scss'
import AuthContext from '../stores/authContext'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

const Home = () => {
  
  const navigate = useNavigate()
  
  const authContext = useContext(AuthContext)
  let { currentUser } = authContext

  useEffect(() => {
    if(currentUser){
      // console.log(currentUser)
      return
    }
    navigate('/login')
  }, [navigate, currentUser])

  return (
    <div className='main'>
      <span>{currentUser && currentUser.displayName}</span>
      <span>{currentUser && currentUser.email}</span>
      <div style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-around', alignItems: 'center'}}>
        <Link to={'/messenger'}><button className='btn' style={{ margin: '0 25px'}}>Start Chat</button></Link>
        <button className='btn' style={{ margin: '0 25px', backgroundColor: '#e46565'}} onClick={()=> signOut(auth)}>Signout</button>
      </div>
    </div>
  )
}

export default Home