import { Router } from 'express'
import {
  getMoviesHandler,
  postMoviesHandler
} from '../controllers/movies.mjs'

const moviesRouter = Router()

moviesRouter.route('/').get(getMoviesHandler).post(postMoviesHandler)
moviesRouter.route('/:page').get(getMoviesHandler)

export default moviesRouter
