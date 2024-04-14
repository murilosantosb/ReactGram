import "./NavBar.css"

// Componentes
import {NavLink, Link} from 'react-router-dom'
import {
    BsSearch,
    BsHouseDoorFill,
    BsFillPersonFill,
    BsFillCameraFill,
    } from 'react-icons/bs'
    import { FaMessage } from "react-icons/fa6";
//hooks
import { useAuth } from "../hooks/useAuth"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import {reset, logout} from '../slices/authSlice'

const NavBar = () => {
    const [query, setQuery] = useState("")

    const { auth } = useAuth()
    const { user } = useSelector(state => state.auth)

    const dispatch = useDispatch()
    let navigate = useNavigate()

    const handleLogout = () => {
        dispatch(logout())
        dispatch(reset())

        navigate("/login")
    }

    const handleSearch = (e) => {
        e.preventDefault()

        if(query) {
            return navigate(`/search?q=${query}`)
        }
    }

  return (
    <nav id="nav">
        <Link to='/'>ReactGram</Link>
        <form id="search-form" onSubmit={handleSearch}>
            <BsSearch/>
            <input
            type="text"
            placeholder="Pesquisar"
            onChange={(e) => setQuery(e.target.value)}
            />
        </form>
        <ul id="nav-links">
            <li>
             <NavLink to='/'>
                <BsHouseDoorFill/>
             </NavLink>
            </li>
            
            {!user &&(
               <>
            <li>
                <NavLink to='/login'>Entrar</NavLink>
            </li>
            <li>
                <NavLink to='/register'>Cadastrar</NavLink>
            </li>
               </>
            )
            }

            {user && (
                <>
                    <li>
                        <NavLink to={`/users/${user._id}`}>
                            <BsFillCameraFill/>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to={`/contacts/${user._id}`}>
                            <FaMessage size={20}/>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/profile">
                            <BsFillPersonFill/>
                        </NavLink>
                    </li>

                    <li>
                     <span onClick={handleLogout}>Sair</span>
                    </li>
                </>
            )
            }

        </ul>
    </nav>
  )
}

export default NavBar