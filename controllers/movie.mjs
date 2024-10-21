import { connectDB } from '../db.mjs'
import { ObjectId } from 'mongodb'

const getMovieByIdHandler = async (req, res, next) => {
  const theme = req.cookies.theme
  const { movieId } = req.params
  const { id, action } = req.query

  try {
    const db = await connectDB();
    const moviesDb = db.collection('movies');

    let [movie, comments] = await Promise.all([
      moviesDb.findOne({ _id: new ObjectId(movieId) }),
      db.collection('comments').find({ movie_id: new ObjectId(movieId) }).toArray()
    ]);

    if (!movie) {
      return res.status(404).send('Movie not found')
    }

    comments = await Promise.all(
      comments.map(async (comment) => {
        const user = await db.collection('users').findOne({ email: comment.email })
        return {
          ...comment,
          userId: user ? user._id : null
        }
      })
    )

    const renderParams = {
      addComment: action === 'addComment' ? true : false,
      editComment: action === 'editComment' ? true : false,
      idComment: action === 'editComment' ? id : false,
      textComment: action === 'editComment' ? comments.find(comment => comment._id.toString() === id).text : false,
      pageTitle: movie.title,
      movie,
      auth: req.isAuthenticated(),
      user: req.user,
      theme: theme || 'light',
      comments,
      userEmail: req.user.email
    }

    res.render('movieById', renderParams)

  } catch (error) {
    next(error)
  }
}

const deleteMovieByIdHandler = (req, res, next) => {
  const { movieId } = req.params
  res.send(`DELETE movie by id: ${movieId}`)
}

const putMovieByIdHandler = (req, res, next) => {
  const { movieId } = req.params
  res.send(`PUT movie by id: ${movieId}`)
}

export {
  getMovieByIdHandler,
  deleteMovieByIdHandler,
  putMovieByIdHandler
}
