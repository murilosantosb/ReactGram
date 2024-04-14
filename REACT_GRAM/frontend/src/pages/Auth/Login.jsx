import "./Auth.css"

// Components
import {Link} from 'react-router-dom'
import Message from "../../components/Message"

// Hooks
import {useState, useEffect} from 'react'

// Redux
import { login, reset } from "../../slices/authSlice"
import { useDispatch, useSelector } from "react-redux"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()

  const {loading, error} = useSelector((state) => state.auth)

  const handleSubmit = (e) => {
    e.preventDefault()

    const user = {
      email,
      password,
    }

    console.log(user)

    dispatch(login(user))
  }

  // Clean all auth state
  useEffect(() => {
    dispatch(reset())
  },[dispatch])

  return (
    <div id="login">
      <h2>ReactGram</h2>
      <p className="subtitle">Faça o login para ver o que há de novo.</p>
      <form onSubmit={handleSubmit}>

        <input type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} value={email || ""}/>
        <input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} value={password || ""}/>
   
        
        {!loading && <input type="submit" value="Entrar" />}
        {loading && <input disabled type="submit" value="Aguarde..." />}
        {error && <Message msg={error} type="error"/>}

      </form>
      <p>
        Não tem uma conta? <Link to='/register'>Clique aqui.</Link>
      </p>
    </div>
  )
}

export default Login