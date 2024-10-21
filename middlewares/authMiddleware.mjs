const auth = async (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.status(401).redirect('/auth/login')
  }
}

export default auth