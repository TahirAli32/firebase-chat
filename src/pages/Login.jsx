import React, { useContext, useEffect, useRef, useState } from 'react'
import '../styles/Login.scss'
import { Link, useNavigate } from "react-router-dom"
import { MdError } from 'react-icons/md'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { BsFillPersonFill } from 'react-icons/bs'
import { FaLock } from 'react-icons/fa'
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from '../firebase'
import AuthContext from '../stores/authContext'

const Login = () => {

  const navigate = useNavigate()

  const authContext = useContext(AuthContext)
  let { currentUser } = authContext

  useEffect(() => {
    if(currentUser){
      navigate('/')
      return
    }
  }, [navigate, currentUser])

  const [emailInput, setEmail] = useState(false)
  const [passwordInput, setPassword] = useState(true)
  const [viewPassword, setViewPassword] = useState(false)
  const [error, setError] = useState(false)

  const emailRef = useRef()
  const passwordRef = useRef()

  const togglePassword = () => {
    setViewPassword(!viewPassword)
  }

  const handleEmail = () => {
    if(!emailRef.current.value.match(/([^\s])/)){
      setError('Email is Required')
      return
    }
    setEmail(emailRef.current.value)
    setPassword(false)
    setError(false)
  }

  const handleLogin = async () => {
    if(!passwordRef.current.value.match(/([^\s])/)){
      setError('Password is Required')
      return
    }
    setError(false)

    try {
      await signInWithEmailAndPassword(auth, emailInput, passwordRef.current.value)
      navigate('/')
    } catch (error) {
      const errorCode = error.code;
      if(errorCode === 'auth/invalid-email'){
        setError("Entered Email is incorrect")
        setEmail(false)
        setPassword(true)
      }
      if(errorCode === 'auth/wrong-password'){
        setError("Entered Password is incorrect")
      }
    }
  }

  return (
    <main>
      <div className="login">
        {!emailInput &&
          <div className='email-login'>
            <h6>Log in your Account</h6>
            <div className="input-field">
              <span className='icon'><BsFillPersonFill /></span>
              <input autoFocus ref={emailRef} id='username' className='input-box' placeholder='Username or Email' type="text" />
            </div>
            {error && <div className='error'><span><MdError /></span>{error}</div>}
            <button className='btn' onClick={()=>handleEmail()}>Continue with Email</button>
            <div className='sign-up'>
              <p>Don't have an Account ?</p>
              <Link to={'/register'}><button className='btn btn-signUp'>Sign Up</button></Link>
            </div>
          </div>
        }
        {!passwordInput &&
          <div className='password-login'>
            <h6>Welcome</h6>
            <p style={{ textAlign: 'center', fontSize: '15px', marginTop: '.5rem' }}>{emailInput}</p>
            <div className="input-field" style={{ marginTop: '1rem' }}>
              <span className='icon'><FaLock /></span>
              <input autoFocus ref={passwordRef} id='password' className='input-box' placeholder='Enter your Password' type={!viewPassword ? 'password' : 'text'} />
              <span className='icon view-pw' onClick={()=>togglePassword()}>{!viewPassword ? <AiFillEye /> : <AiFillEyeInvisible />}</span>
            </div>
            {error && <div className='error'><span><MdError /></span>{error}</div>}
            <div className="otherChecks" style={{ marginTop: '5px' }}>
              <div>
                <input style={{ cursor: 'pointer' }} type='checkbox' id='rememberMe' />
                <label htmlFor='rememberMe' style={{ marginLeft: '5px', cursor: 'pointer' }}>Keep me logged in</label>
              </div>
              <p className='forgotPw'>Forgot Password?</p>
            </div>
            <button className='btn' style={{marginTop: '1.5rem'}} onClick={()=>handleLogin()}>Login</button>
          </div>
        }
      </div>
    </main>
  )
}

export default Login