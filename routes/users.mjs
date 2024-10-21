import { Router } from 'express'
import {
  getUsersHandler,
  postUsersHandler
} from '../controllers/users.mjs'

const usersRouter = Router()

usersRouter.route('/')
  .get(getUsersHandler)
  .post(postUsersHandler)

usersRouter.route('/:page')
  .get(getUsersHandler)

export default usersRouter
