import { onAuthStateChanged } from "firebase/auth"
import { createContext, useState, useEffect } from "react"
import { auth } from '../firebase'

const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {

    const [currentUser, setCurrentUser] = useState(false)

    useEffect(() => {
      const unsub = onAuthStateChanged(auth, (user)=>{
        setCurrentUser(user)
      })
      return () => unsub()
    }, [])

    return(
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext