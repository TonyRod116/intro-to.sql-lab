import User from '../models/user.js'
import express from 'express'
import { InvalidDataError } from '../utils/errors.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const router = express.Router()

// *Starting path: /api/auth
// *Sign Up
router.post('/sign-up', async (req, res, next) => {
  try {
    const { username, email, password, passwordConfirmation} = req.body

    // password confirmation
    if (password !== passwordConfirmation) {
      throw new InvalidDataError('Passwords do not match.', 'password')
    }

    // create user
    const newUser = await User.create({ username, email, password })

    // JWT user info token
    const token = generateToken(foundUser)

    // Send the response to the client
    res.status(201).json({token:token})

    // responded message
    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
      token
    })
  } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// *Sign In
router.post('/sign-in', async (req, res, next) => {
  try {
    //search for the user by username OR email
const foundUser = await User.findOne({$or:[{username:req.body.username},{email:req.body.email}]})

    if (!foundUser) {throw new UnauthorizedError('User not found')}

    // compare the hash against the provded plain text password
    if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
      throw new UnauthorizedError('Password is incorrect')
    }

// generate the token
const token = generateToken(foundUser)

// send the response to the client
    res.status(200).json({token:token})

    // responded message
    res.status(200).json({
      message: 'Login successful',
      user: foundUser,
      token
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})





export default router