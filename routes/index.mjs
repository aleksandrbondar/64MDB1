import { Router } from 'express'
import rootRouter from './root.mjs'
import usersRouter from './users.mjs'
import moviesRouter from './movies.mjs'
import movieRouter from './movie.mjs'
import apiRouter from './api.mjs'
import authMiddleware from './../middlewares/authMiddleware.mjs'
import authRouter from './auth.mjs'
import userRouter from './user.mjs'

const router = Router()

router.use('/', rootRouter)
router.use('/users', authMiddleware, usersRouter)
router.use('/user', authMiddleware, userRouter)
router.use('/movies', authMiddleware, moviesRouter)
router.use('/movie', authMiddleware, movieRouter)
router.use('/auth', authRouter)
router.use('/api', apiRouter)

router.use('*', (req, res) => res.status(404).end('Not found'))

export default router