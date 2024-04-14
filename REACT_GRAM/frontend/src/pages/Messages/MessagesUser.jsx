// CSS
import "./MessagesUser.css"

// Rotas
import { uploads } from "../../utils/config"

//icons
import { CiPhone } from "react-icons/ci";
import { IoMdVideocam } from "react-icons/io";
import { CiCircleInfo } from "react-icons/ci";
import { SiIconify } from "react-icons/si";
import { TiMicrophoneOutline } from "react-icons/ti";
import { GrGallery } from "react-icons/gr";
import { GrClose } from "react-icons/gr";

//Componentes
import Loading from "../../components/Loading"

// Hooks
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom";

// redux
import {getUserDetails} from '../../slices/userSlice'
import {getMessageId, sendMessage, deleteMessage} from "../../slices/messageSlice"

const MessagesUser = () => {
  const [message, setMessage] = useState("")

  const { id } = useParams()

  const dispatch = useDispatch()


  const { user, loading, error } = useSelector(state => state.user)
  const { messages, loading: messageLoading } = useSelector(state => state.message)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(message.trim() === "") return;

    const messageData = {
      message: message,
      id: id
    }

    dispatch(sendMessage(messageData))
    setMessage("")
  }

  const handleDeleteMessage = async (id) => {
    await dispatch(deleteMessage(id))
  }

  useEffect(() => {

    dispatch(getMessageId(id))
    dispatch(getUserDetails(id))

  }, [dispatch, id])

  if(loading){
    return <Loading/>
  }

  return (
    <div className="messages-container">
      <header>
          <span className="user-data">
          {user.profileImage && (
            <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
          )}
          <h2>{user.name}</h2>
          </span>

          <span className="message-icons">
            <CiPhone/>
            <IoMdVideocam/>
            <CiCircleInfo/>
          </span>
      </header>

          <div className="containerMessages">
      <section className="info-user">
          {user.profileImage && (
            <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
          )}
          <h2>{user.name}</h2>
          <p>ReactGram</p>
          <Link to={`/users/${id}`} className="btn unfollower">Ver perfil</Link>
      </section>

      <section className="messages-users" >
        {Array.isArray(messages) && messages.map((message) => (
          <span key={message._id} className={message.sender === user._id ? "receivedMessage" : "sentMessage"}>
            {message.sender !== user._id && (
              <GrClose className="delete" onClick={() => handleDeleteMessage(message._id)}/>
            )}
            {message.sender === id && (
              <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
            )}
            <p>{message.message}</p>
            <p className="timestamp">{message.timestamp}</p>
          </span>
        ))}
        
      </section>
      </div>

          <form className="form-message" onSubmit={handleSubmit}>
            <SiIconify/>
              <input
              type="text"
              placeholder="Mensagem..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              />
            {message.length === 0 ? (
              <>
                <TiMicrophoneOutline/>
                <GrGallery/>
              </>
            ) : (
              <input type="submit" value="Enviar" className="input-form"/>
            )}
          </form>

    </div>
  )
}

export default MessagesUser



/*

{Array.isArray(messages) && messages.map((messageObj) => (
          <>
            {messageObj && messageObj.receivedMessages.map((message) => (
              <span key={message._id} className="receivedMessage">
                <GrClose className="delete" onClick={() => dispatch(deleteMessage(message._id))}/>
                {user.profileImage && (
                  <img src={`${uploads}/users/${user.profileImage}`} alt="" />
                )
                }
                <h4>{message.message}</h4>

                {/* {date.getHours() > 23 ? (
                  <p>{message.timestamp.slice(0,10)}</p>
                )
                : (
                  <p>{message.timestamp.slice(11,16)}</p>
                )
                } */
          //       </span>
          //     ))}
  
          //     {/* Mensagens que eu envio */}
          //     {messageObj && messageObj.sentMessages.map((message) => (
          //       <span key={message._id} className="sentMessage">
          //         <GrClose className="delete" onClick={() => dispatch(deleteMessage(message._id))}/>
          //         <p>{message.message}</p>
          //       </span>
          //     ))
          //     }
          //   </>
          // ))
          // }

