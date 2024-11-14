import { connectDB } from '../db.mjs';

const getMoviesHandler = async (req, res, next) => {
  const page = req.params.page ?? 1;
  const theme = req.cookies.theme;

  try {
    const db = await connectDB();
    const moviesDb = db.collection('movies');

    const cursor = moviesDb.aggregate([
      { $skip: (page - 1) * 20 },
      { $limit: 20 },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'movie_id',
          as: 'comments'
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          poster: 1,
          plot: 1,
          fullplot: 1,
          countComments: { $size: '$comments' }
        }
      }
    ]);

    const movies = await cursor.toArray();
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
