import { connectDB } from '../db.mjs'

const getUsersHandler = async (req, res, next) => {
  const page = req.params.page ?? 1;
  const theme = req.cookies.theme
  try {
    const db = await connectDB()
    const usersDb = db.collection('users')

    const users = await usersDb.find({}).skip((page - 1) * 20).limit(20).toArray()
    const totalUsersCount = await usersDb.countDocuments({});

    if (!users) {
      return res.status(404).send('Users not found')
    }

    const usersList = users.map(user => {
      return {
        ...user,
        _id: user._id.toString()
      }
    })

    const renderParams = {
      pageTitle: 'All Users',
      usersById: usersList,
      auth: req.isAuthenticated(),
      user: req.user,
      pages: Math.ceil(totalUsersCount / 20),
      baseUrl: req.baseUrl,
      currectPage: +page,
      theme: theme ?? 'light'
    };

    res.render('users', renderParams);
  } catch (error) {
    next(error)
  }
}

const postUsersHandler = (req, res, next) => {
  try {
    res.send('POST users route')
  } catch (error) {
    next(error)
  }

}

export { getUsersHandler, postUsersHandler }
