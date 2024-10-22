import { connectDB } from '../db.mjs';
import { ObjectId } from 'mongodb';

const getMoviesHandler = async (req, res, next) => {
  const page = req.params.page ?? 1;
  const theme = req.cookies.theme;

  try {
    const db = await connectDB();
    const moviesDb = db.collection('movies');

    const cursor = moviesDb.find({}).skip((page - 1) * 20).limit(20);

    let movies = [];

    while (await cursor.hasNext()) {
      const movie = await cursor.next();

      const commentCount = await db.collection('comments').countDocuments({
        movie_id: new ObjectId(movie._id)
      });

      movies.push({
        ...movie,
        comments: commentCount
      });
    }

    const totalMoviesCount = await moviesDb.countDocuments({});

    const renderParams = {
      pageTitle: 'All Movies',
      movies,
      auth: req.isAuthenticated(),
      user: req.user,
      pages: Math.ceil(totalMoviesCount / 20),
      baseUrl: req.baseUrl,
      currectPage: +page,
      theme: theme || 'light'
    };

    res.render('movies', renderParams);
  } catch (error) {
    next(error);
  }
};

const postMoviesHandler = (req, res, next) => {
  res.send('POST Movies route')
}

export {
  getMoviesHandler,
  postMoviesHandler,
}
