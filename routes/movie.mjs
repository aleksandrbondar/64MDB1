import { Router } from 'express'
import {
  deleteMovieByIdHandler,
  getMovieByIdHandler,
  putMovieByIdHandler,
} from '../controllers/movie.mjs'

const movieRouter = Router()

movieRouter
  .route('/:movieId')
  .get(getMovieByIdHandler)
  .put(putMovieByIdHandler)
  .delete(deleteMovieByIdHandler)

export default movieRouter
