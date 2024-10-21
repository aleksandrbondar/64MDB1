import { connectDB } from '../db.mjs'

const getMoviesHandler = async (req, res, next) => {
  const page = req.params.page ?? 1;
  const theme = req.cookies.theme;

  try {
    const db = await connectDB();
    const moviesDb = db.collection('movies');

    const movies = await moviesDb.find({}).skip((page - 1) * 20).limit(20).toArray()
    const totalMoviesCount = await moviesDb.countDocuments({});

    if (!movies) {
      return res.status(404).send('Movies not found')
    }

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
