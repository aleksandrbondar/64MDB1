import Tokens from 'csrf'

const tokens = new Tokens()

const csrfGet = async (req, res, next) => {
  let secret
  if (!req.cookies.csrfSecret) {
    secret = tokens.secretSync()
    res.cookie('csrfSecret', secret, { httpOnly: true })
  } else {
    secret = req.cookies.csrfSecret
  }
  const token = tokens.create(secret)
  res.locals.csrfToken = token
  next()
}

const csrfPost = async (req, res, next) => {
  const secret = req.cookies.csrfSecret
  const token = req.body._csrf
  if (tokens.verify(secret, token)) {
    next()
  } else {
    res.status(403).send('Invalid CSRF token')
  }
}

export { csrfGet, csrfPost }