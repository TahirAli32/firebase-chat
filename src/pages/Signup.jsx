import React, { useRef, useState } from 'react'
import '../styles/Signup.scss'
import { Link, useNavigate } from "react-router-dom"
import { MdError } from 'react-icons/md'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { FiUpload } from 'react-icons/fi'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from 'firebase/firestore'
import { auth, db, storage } from '../firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { RiLoader3Fill } from 'react-icons/ri'

const Signup = () => {
  const navigate = useNavigate()

  const [viewPassword, setViewPassword] = useState(false)
  const [error, setError] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [profile, setProfile] = useState("")

  const nameRef = useRef()
  const emailRef = useRef()
  const usernameRef = useRef()
  const passwordRef = useRef()

  const handleSignUp = async () => {
    if(!nameRef.current.value.match(/([^\s])/) || !usernameRef.current.value.match(/([^\s])/) || !emailRef.current.value.match(/([^\s])/) || !passwordRef.current.value.match(/([^\s])/) || profile === "" ){
      setError('All fields are required')
      return
    }
    setError(false)

    setLoading(true)
    try{
      const res = await createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)

      const storageRef = ref(storage, usernameRef.current.value)

      const uploadTask = uploadBytesResumable(storageRef, profile);

      uploadTask.on('state_changed', 
        (snapshot) => {
        }, 
        (error) => {
          setError(error)
        },
        () => {
          setError(false)
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, { 
              displayName: nameRef.current.value,
              photoURL: downloadURL
            })
            await setDoc(doc(db, "users", res.user.uid),{
              uid: res.user.uid,
              displayName: nameRef.current.value,
              email: emailRef.current.value,
              username: usernameRef.current.value,
              photoURL: downloadURL
            })
            await setDoc(doc(db, "userChats", res.user.uid), {})
            setLoading(false)
            navigate('/')
          })
        }
      )
    }
    catch(error){
      const errorCode = error.code
      if(errorCode === 'auth/email-already-in-use') {
        setError("Email Already Exists")
        setLoading(false)
      }
      if(errorCode === 'auth/invalid-email') {
        setError("Please Enter a Valid Email")
        setLoading(false)
      }
      if(errorCode === 'auth/weak-password') {
        setError("Password should be 6 characters long")
        setLoading(false)
      }
    }
  }

  const handleUpload = (event) => {
    setProfile(event.target.files[0])
  }

  return (
    <main>
      <div className="signup" onKeyDown={e => e.code === "Enter" && handleSignUp()}>
        <h6>Create a Free Account</h6>
        {error && <div className='error'><span><MdError /></span>{error}</div>}
        <div className="inputField">
          <input autoFocus ref={nameRef} id='name' placeholder=" " className='inputBox' type="text" />
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
        <div className='uploadFile'>
          <input type="file" id="assignmentFile" onChange={(e) => handleUpload(e)} />
          <label htmlFor="assignmentFile">
            <div className='btn'><span><FiUpload /></span>Upload Profile Photo</div>
          </label>
        </div>
        <div className='disclaimer'>
          <span>I agree to the Terms of Use and Privacy Policy</span>
        </div>
        <button className='btn' onClick={()=>handleSignUp()} style={!isLoading ? {marginTop: '1.5rem'} : {marginTop: '1.5rem', padding: '6.5px 0'}}>{!isLoading ? 'Sign Up' : <span className='loadingIcon'><RiLoader3Fill /></span>}</button>
        <p className="logIn">Already have an account? <Link to={'/login'}>Log In</Link></p>
      </div>
    </main>
  )
}

export default Signup