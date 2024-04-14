
const User = require("../models/User")
const mongoose = require("mongoose")


const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const jwtSecret = process.env.JWT_SECRET

// Generate user token
const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: "7d"
    })
}

// Register user and sign in
const register = async (req, res) => {
   
    const {name, email, password} = req.body

    //check if user exists
    const user = await User.findOne({email}) //findOne - encontre um ...

    if(user){
        res.status(422).json({errors: ["Por favor, utilize outro e-mail."]})
        return
    }

    // Generate password hash
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user
    const newUser = await User.create({
        name,
        email,
        password: passwordHash
    })

    // If user was created successfully, return the token
    if(!newUser) {
        res.status(422).json({errors: ["Houve um erro, por favor tente mais tarde."]})
    }

    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id)
    })
}


// Sign user in
const login = async (req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({email})

    //Check if user exists
    if(!user){
        res.status(404).json({errors: ["Usuário não encontrado."]})
        return
    }

    //Check if password matches
    if(!(await bcrypt.compare(password, user.password))) {
        res.status(422).json({errors: ["Senha inválida."]})
        return
    }

    //Return user with token
    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user._id)
    })
}

// Get current logged in user
const getCurrentUser = async (req, res) => {
    const user = req.user

    res.status(200).json(user)
}

// Update an user
const update = async(req, res) => {
    
    const {name, password, bio} = req.body

    let profileImage = null

    if(req.file) {
        profileImage = req.file.filename
    }

    const reqUser = req.user

    const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id)).select("-password")

    if(name) {
        user.name = name
    }

    if(password){
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        user.password = passwordHash
    }

    if(profileImage) {
        user.profileImage = profileImage
    }

    if(bio) {
        user.bio = bio
    }

    await user.save()

    res.status(200).json(user)
}

// Get user by id
const getUserById = async(req, res) => {

    const {id} = req.params

    try {
        const user = await User.findById(new mongoose.Types.ObjectId(id)).select("-password")

         // Check if user exists
        if(!user) {
            res.status(404).json({errors: ["Usuário não encontrado."]})
            return
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({errors: ["Usuário não encontrado."]})
        return
    }

}

const following = async(req, res) => {

    const { id } = req.params
    const { followers } = req.body
    const followerId = req.user._id

    try {

        // Buscar o Id do usuário que eu quero seguir
        const userToFollow = await User.findById(id)
        // Buscar o meu Id
        const follower = await User.findById(followerId)

        const user = await User.findById(new mongoose.Types.ObjectId(id))
        .select("-password")

        if(!userToFollow || !follower) {
            return res.status(404).json({errors: ["Usuário não encontrado"]})
        }

        if(userToFollow.followers.includes(followerId) && follower.following.includes(id)){
          return res.status(409).json({errors: ["Você já está seguindo este usuário."]})
        }

        if(followers){
            user.followers = followers
        }
        
        userToFollow.followers.push(followerId)
        await userToFollow.save()
        
        follower.following.push(user._id)
        await follower.save()

        await user.save()

        res.status(200).json({userId: followerId, user: user ,message: "Você começou a seguir esse usuário."})
        

    } catch (error) {
        res.status(500).json({ errors: ["Não foi possível seguir o usuário."] })
    }
}

const unfollow = async (req, res) => {

    const { id } = req.params

    const reqUser = req.user

    try {
        
        const userIWantToUnfollow = await User.findById(id).select("-password");
        const myUser = await User.findById(reqUser._id).select("-password");


        if (!userIWantToUnfollow || !myUser) {
           return res.status(404).json({errors: ["Você não seguir este usuário."]})
        }

        myUser.following = myUser.following.filter(followingId => followingId.toString() !== id.toString())
        await myUser.save()

        userIWantToUnfollow.followers = userIWantToUnfollow.followers.filter(followerId => followerId.toString() !== reqUser._id.toString())
        await userIWantToUnfollow.save()

        res.status(200).json({userId: reqUser._id ,message: "Você parou de seguir com sucesso!"})
        

    } catch (error) {
        res.status(404).json({errors: ["Usuário não encontrado!"]})
    }

}


module.exports = {
    register, 
    login,
    getCurrentUser,
    update,
    getUserById,
    following,
    unfollow
}