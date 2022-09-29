import { createContext, useContext, useReducer } from "react"
import AuthContext from "./authContext"

const MessagesContext = createContext()

export const MessagesContextProvider = ({children}) => {

    const { currentUser } = useContext(AuthContext)

    const INITIAL_STATE = {
        chatID: "null",
        user: {}
    }

    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatID: currentUser.uid > action.payload.uid
                    ? currentUser.uid + action.payload.uid
                    : action.payload.uid + currentUser.uid
                }
            case "NULL":
                return{
                    chatID: "null",
                    user: {}
                }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)

    return(
        <MessagesContext.Provider value={{ data:state, dispatch }}>
            {children}
        </MessagesContext.Provider>
    )
}

export default MessagesContext