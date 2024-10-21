import { connectDB } from '../db.mjs'
import { ObjectId } from 'mongodb'

const getRootHandler = async (req, res, next) => {
  const theme = req.cookies.theme
  try {
    const db = await connectDB();

    const randomMovie = await db.collection('movies').aggregate([
      {
        $match: {
          year: { $gte: 2010, $lte: 2024 },
          'imdb.rating': { $gte: 6 },
          poster: { $exists: true, $ne: '' }
        }
      },
      { $sample: { size: 1 } }
    ]).toArray();

    const renderParams = {
      theme: theme ?? 'light',
      pageTitle: 'Main page',
      auth: req.isAuthenticated(),
      user: req.user,
      movie: randomMovie[0]
    };

    res.render('index', renderParams);
  } catch (err) {
    next(err)
  }

}

export { getRootHandler }