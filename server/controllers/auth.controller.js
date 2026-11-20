import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { expressjwt } from "express-jwt";
import config from './../../config/config.js'

// POST /auth/signin
const signin = async (req, res) => {
  try {
    let user = await User.findOne({ "email": req.body.email })
    if (!user)
      return res.status(401).json({ error: "User not found" })
    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({ error: "Email and password don't match." })
    }
    const token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '8h' })
    res.cookie('t', token, { maxAge: 8 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax' })
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      }
    })
  } catch (err) {
    return res.status(401).json({ error: "Could not sign in" })
  }
}

// GET /auth/signout
const signout = (req, res) => {
  res.clearCookie("t")
  return res.status(200).json({
    message: "signed out"
  })
}

// Protects a route: the request needs the header
// Authorization: Bearer <token>
// The decoded token is saved in req.auth
const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  requestProperty: 'auth'
})

// A signed-in user can only change their own account
const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth
    && req.profile._id == req.auth._id
  if (!(authorized)) {
    return res.status(403).json({
      error: "User is not authorized"
    })
  }
  next()
}

// Only admins may continue. The role is read from the database on every
// request, so removing a user's admin role takes effect immediately.
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth && req.auth._id).select('role')
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access is required." })
    }
    next()
  } catch (err) {
    return res.status(403).json({ error: "Admin access is required." })
  }
}

// GET /auth/me -> the signed-in user's account (used to restore a session)
const me = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id).select('name email role')
    if (!user) return res.status(401).json({ error: "User not found" })
    return res.json({ _id: user._id, name: user.name, email: user.email, role: user.role || 'user' })
  } catch (err) {
    return res.status(401).json({ error: "Could not load the account" })
  }
}

export default { signin, signout, requireSignin, hasAuthorization, requireAdmin, me }
