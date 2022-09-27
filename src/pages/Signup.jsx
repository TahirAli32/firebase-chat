import React, { useRef, useState } from 'react'
import '../styles/Signup.scss'
import { Link, useNavigate } from "react-router-dom"
import { MdError } from 'react-icons/md'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from 'firebase/firestore'

const Signup = () => {
  const navigate = useNavigate()

  const [viewPassword, setViewPassword] = useState(false)
  const [error, setError] = useState(false)

  const nameRef = useRef()
  const emailRef = useRef()
  const usernameRef = useRef()
  const passwordRef = useRef()

  const handleSignUp = async () => {
    if(!nameRef.current.value.match(/([^\s])/) || !usernameRef.current.value.match(/([^\s])/) || !emailRef.current.value.match(/([^\s])/) || !passwordRef.current.value.match(/([^\s])/) ){
      setError('All fields are required')
      return
    }
    setError(false)

    try{
      const res = await createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
      await updateProfile(auth.currentUser, { displayName: nameRef.current.value })
      await setDoc(doc(db, "users", res.user.uid),{
        fullName: nameRef.current.value,
        email: emailRef.current.value,
        username: usernameRef.current.value
      })

      nameRef.current.value = ""
      emailRef.current.value = ""
      usernameRef.current.value = ""
      passwordRef.current.value = ""
      navigate('/')
    }
    catch(error){
      const errorCode = error.code
      if(errorCode === 'auth/email-already-in-use') setError("Email Already Exists")
      if(errorCode === 'auth/invalid-email') setError("Please Enter a Valid Email")
      if(errorCode === 'auth/weak-password') setError("Password should be 6 characters long")
    }
  }

  return (
    <main>
      <div className="signup">
        <h6>Create a Free Account</h6>
        {error && <div className='error'><span><MdError /></span>{error}</div>}
        <div className="inputField">
          <input ref={nameRef} id='name' placeholder=" " className='inputBox' type="text" />
          <label htmlFor="name" className='inputLabel'>Full Name</label>
        </div>
        <div className="inputField">
          <input ref={usernameRef} id='username' placeholder=" " className='inputBox'  type="text" />
          <label htmlFor="username" className='inputLabel'>Username</label>
        </div>
        <div className="inputField">
          <input ref={emailRef} id='email' placeholder=" " className='inputBox' type="text" />
          <label htmlFor="email" className='inputLabel'>Email Address</label>
        </div>
        <div className="inputField">
          <input ref={passwordRef} style={{padding: '0 0 0 1rem'}} id='password' placeholder=" " className='inputBox' type={!viewPassword ? 'password' : 'text'} />
          <label htmlFor="password" className='inputLabel'>Password</label>
          <span className='viewPw' onClick={()=>setViewPassword(!viewPassword)}>{!viewPassword ? <AiFillEye /> : <AiFillEyeInvisible />}</span>
        </div>
        <div className='disclaimer'>
          <span>I agree to the Terms of Use and Privacy Policy</span>
        </div>
        <button className='btn' onClick={()=>handleSignUp()} style={{ marginTop: '1.5rem' }}>Sign Up</button>
        <p className="logIn">Already have an account? <Link to={'/login'}>Log In</Link></p>
      </div>
    </main>
  )
}

export default Signup