import { Router } from 'express'
import {
  deleteUserByIdHandler,
  getUserByIdHandler,
  putUserByIdHandler
} from '../controllers/user.mjs'

const userRouter = Router()

userRouter
  .route('/:userId')
  .get(getUserByIdHandler)
  .put(putUserByIdHandler)
  .delete(deleteUserByIdHandler)

export default userRouter
