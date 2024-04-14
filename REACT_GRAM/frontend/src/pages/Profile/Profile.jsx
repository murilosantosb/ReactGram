import "./Profile.css"

import { uploads } from '../../utils/config'

//Components
import Message from "../../components/Message"
import Loading from "../../components/Loading"
import { Link } from "react-router-dom"
import { BsFillEyeFill, BsPencilFill, BsXLg } from 'react-icons/bs'

// hooks
import { useState, useEffect, useRef, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

// redux
import {getUserDetails, following, unfollow} from '../../slices/userSlice'
import { publishPhoto, resetMessage, getUserPhotos, deletePhoto, updatePhoto } from "../../slices/photoSlice"

const Profile = () => {

    const { id } = useParams()
    const dispatch = useDispatch()

    const {user, loading, message: messageUser} = useSelector((state) => state.user)
    const {user: userAuth} = useSelector((state) => state.auth)
    const {photos, photo, loading:loadingPhoto , error: errorPhoto, message: messagePhoto} = useSelector((state) => state.photo)

    const [title, setTitle] = useState("")
    const [image, setImage] = useState("")

    const [editTitle, setEditTitle] = useState("")
    const [editImage, setEditImage] = useState("")
    const [editId, setEditId] = useState("")

    const [isFollowing, setIsFollowing] = useState(false)


    // New form and edit form ref
    const newPhotoForm = useRef()
    const editPhotoForm = useRef()

    // Load user data
    useEffect(() => {
        dispatch(getUserDetails(id))
        dispatch(getUserPhotos(id))
    },[dispatch, id])

    function resetComponentMessage(){
        setTimeout(() => {
            dispatch(resetMessage())
        }, 2000)
    }

    const handleFile = (e) => {
        const image = e.target.files[0]

        setImage(image)
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()

        const photoData = {
            title,
            image
        }

        // build form data
        const formData = new FormData()

        const photoFormData = Object.keys(photoData).forEach((key) => 
            formData.append(key, photoData[key])
        )

        formData.append("photo", photoFormData)

       dispatch(publishPhoto(formData))

        setTitle("")
        setImage("")

        resetComponentMessage()

    }

    const handleDelete = (id) => {
        
       dispatch(deletePhoto(id))

        resetComponentMessage()
    }

    // Shor or hide forms
    const hideOrShowForms = () => {
        newPhotoForm.current.classList.toggle("hide")
        editPhotoForm.current.classList.toggle("hide")
    }

    // Update a photo
    const handleUpdate = (e) => {
        e.preventDefault()

        const photoData = {
            title: editTitle,
            id: editId,
        }

        dispatch(updatePhoto(photoData))

        resetComponentMessage()
    }

    const handleEdit = (photo) => {
        if(editPhotoForm.current.classList.contains("hide")){
            hideOrShowForms()
        }

        setEditId(photo._id)
        setEditTitle(photo.title)
        setEditImage(photo.image)
    }

    const handleCancelEdit = (e) => {
        hideOrShowForms()
    }

    const handleFollow = async () => {
        try {
            await dispatch(following(id))
            // setIsFollowing(true)
            dispatch(getUserDetails(id))
        } catch (error) {
            console.log(error)
        }
    }

    const handleUnfollow = async () => {
        try{
            await dispatch(unfollow(id))
            setIsFollowing(false)
            await dispatch(getUserDetails(id))
        }catch (error) {
            console.log(error)
        }
    } 
   

    if(loading){
        return <Loading />
    }

  return (
    <div id="profile">
        <div className="profile-header">
            {user.profileImage && (
                <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
            )}
            <div className="profile-description">
                <span>
                <h2>{user.name}</h2>

                {id !== userAuth._id && user.followers && !user.followers.includes(userAuth._id) && (
                    <button className="btn" onClick={handleFollow}>Seguir</button>
                )}
                {!isFollowing && id !== userAuth._id && user.followers && user.followers.includes(userAuth._id) && (
                    <button className="unfollower" onClick={handleUnfollow}>Seguindo</button>
                )}
                {/* {messageUser && <Message msg={messageUser} type="success" />} */}

               {id !== userAuth._id && (
                 <Link className="btn unfollower" to={`/messages/${id}`}>Enviar mensagem</Link>
               )}
                </span>

                <div className="info-user">
                    {user && (
                        <>
                            <p>{user.posts ? user.posts.length : 0} Publicações</p>
                            <p>{user.followers ? user.followers.length : 0} Seguidores</p>
                            <p>{user.following ? user.following.length : 0} Seguindo</p>
                        </>
                    )}
                </div>
                <p>{user.bio}</p>
            </div>
        </div>
        {id === userAuth._id && (
            <>
                <div className="new-photo" ref={newPhotoForm}>
                
                    <h3>Compartilhe algum momento seu:</h3>
                    <form onSubmit={handleSubmit}>
                        <label>
                            <span>Título para a foto:</span>
                            <input
                             type="text"
                              placeholder="Insira um título"
                              onChange={(e) => setTitle(e.target.value)}
                              value={title || ""}
                               />
                        </label>
                        <label>
                            <span>Imagem:</span>
                            <input
                             type="file"
                             onChange={handleFile}
                             />
                        </label>
                        {!loadingPhoto && <input type="submit" value="Postar" />}
                        {loadingPhoto && <input disabled type="submit" value="Aguarde..." />}
                        
                    </form>
                    </div>
                    <div className="edit-photo hide" ref={editPhotoForm}>
                        <p>Editando:</p>
                        {editImage && (
                            <img src={`${uploads}/photos/${editImage}`} alt={editTitle}/>
                        )}
                        <form onSubmit={handleUpdate}>
                            <input
                             type="text"
                             onChange={(e) => setEditTitle(e.target.value)}
                             value={editTitle || ""}
                              />
                              {loadingPhoto && (<input type="submit" disabled value="Aguarde..." />)}
                              {!loadingPhoto && (<input type="submit" value="Atualizar" />)}
                              <button className="cancel-btn" onClick={handleCancelEdit}>Cancelar edição</button>
                        </form>
                </div>
                
                {errorPhoto && <Message msg={errorPhoto} type="error"/>}
                {messagePhoto && <Message msg={messagePhoto} type="success"/>}
            </>
        )}
        <div className="user-photos">
            <h2>Fotos publicadas:</h2>
            <div className="photos-container">
                {photos && photos.map((photo) => (
                    <div className="photo" key={photo._id}>
                        {photo.image && (
                        <img 
                            src={`${uploads}/photos/${photo.image}`}
                            alt={photo.title}
                        />
                    )}
                    {id === userAuth._id ? (
                        <div className="actions">
                            <Link to={`/photos/${photo._id}`}>
                                <BsFillEyeFill />
                            </Link>
                            <BsPencilFill onClick={() => handleEdit(photo)}/>
                            <BsXLg onClick={() => handleDelete(photo._id)}/>
                        </div>
                    ) : (
                        <Link className="btn no-user" to={`/photos/${photo._id}`}>
                            ver
                        </Link>
                    )}
                    </div>
                ))}
                {photos.length === 0 && (<p>Ainda não há fotos publicadas!</p>)}
            </div>
        </div>
    </div>
  )
}

export default Profile