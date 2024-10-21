import { connectDB } from '../db.mjs'
import { ObjectId } from 'mongodb'

const setThemeHandler = (req, res, next) => {
  try {
    const { theme } = req.params
    res.cookie('theme', theme, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
    res.end()
  } catch (err) {
    next(err)
  }
}

const deleteCommentHandler = async (req, res, next) => {
  const { id } = req.params
  const { movieId } = req.query

  if (!id) {
    return res.status(400).json({ error: 'Comment ID is required' })
  }

  try {
    const db = await connectDB();
    const comment = await db.collection('comments').findOne({ _id: new ObjectId(id) })

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    if (comment.email === req.user.email) {
      await db.collection('comments').deleteOne({ _id: new ObjectId(id) })

      res.redirect(movieId.length > 0 ? `/movie/${movieId}` : '/');
    } else {
      res.status(401).json({ error: 'Unauthorized' })
    }
  } catch (error) {
    next(error)
  }
}

const postCommentHandler = async (req, res, next) => {
  const { id } = req.params
  const { text } = req.body

  if (!id) {
    return res.status(400).json({ error: 'Movie ID is required' })
  }

  if (!text) {
    return res.status(400).json({ error: 'Text is required' })
  }

  try {
    const db = await connectDB();
    const movie = await db.collection('movies').findOne({ _id: new ObjectId(id) })

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' })
    }

    const comment = {
      email: req.user.email,
      name: req.user.name,
      text,
      movie_id: movie._id,
      date: new Date()
    }

    await db.collection('comments').insertOne(comment)
    res.status(201).redirect(`/movie/${id}`)
  } catch (error) {
    next(error)
  }
}

const patchCommentHandler = async (req, res, next) => {
  const { id } = req.params
  const { text } = req.body

  if (!id) {
    return res.status(400).json({ error: 'Comment ID is required' })
  }

  if (!text) {
    return res.status(400).json({ error: 'Text is required' })
  }

  try {
    const db = await connectDB();
    const comment = await db.collection('comments').findOne({ _id: new ObjectId(id) })

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    if (comment.email === req.user.email) {
      await db.collection('comments').updateOne({ _id: new ObjectId(id) }, { $set: { text } })
      res.redirect(`/movie/${comment.movie_id}`);
    } else {
      res.status(401).json({ error: 'Unauthorized' })
    }
  } catch (error) {
    next(error)
  }
}

export { setThemeHandler, deleteCommentHandler, postCommentHandler, patchCommentHandler }