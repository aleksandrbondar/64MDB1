import { connectDB } from '../db.mjs'
import { ObjectId } from 'mongodb'

const getUserByIdHandler = async (req, res, next) => {
  const { userId } = req.params
  const theme = req.cookies.theme

  try {
    const db = await connectDB()
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })

    res.render('userById', { userById: user, pageTitle: `User ${user.name}`, auth: req.isAuthenticated(), user: req.user, theme: theme ?? 'light' })
  } catch (err) {
    next(err)
  }
}

const deleteUserByIdHandler = (req, res, next) => {
  const { userId } = req.params
  res.send(`DELETE user by id: ${userId}`)
}

const putUserByIdHandler = (req, res, next) => {
  const { userId } = req.params
  res.send(`PUT user by id route with id: ${userId}`)
}

export { getUserByIdHandler, deleteUserByIdHandler, putUserByIdHandler }
