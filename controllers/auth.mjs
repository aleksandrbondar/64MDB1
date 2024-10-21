import { connectDB } from '../db.mjs'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'


// Login GET controller
const getLoginHandler = (req, res, next) => {

  try {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }

    const renderParams = {
      pageTitle: 'Login',
      theme: req.cookies.theme ?? 'light',
      csrfToken: res.locals.csrfToken
    }

    res.render('login', renderParams)
  } catch (err) {
    next(err)
  }
}

// Login POST controller
const postLoginHandler = async (req, res, next) => {

  const { email, password } = req.body

  try {
    const db = await connectDB()

    const user = await db.collection('users').findOne({ email })
    if (!user) {
      res.render('login', { theme: req.cookies.theme ?? 'light', error: 'User does not exist. You need to register first!', isNeedToReg: true });
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.render('login', { theme: req.cookies.theme ?? 'light', error: 'Wrong username or password' });
    }

    req.login(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.redirect('/');
    });

  } catch (err) {
    next(err)
  }
}

// Register GET controller
const getRegisterHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  try {
    const renderParams = {
      pageTitle: 'Register',
      theme: req.cookies.theme ?? 'light',
      csrfToken: res.locals.csrfToken
    }
    res.status(200).render('registration', renderParams)
  } catch (err) {
    next(err)
  }
}

// Register POST controller
const postRegisterHandler = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body

  if (password !== confirmPassword) {
    res.render('registration', { theme: req.cookies.theme ?? 'light', error: 'Passwords do not match' });
    return;
  }

  try {
    const db = await connectDB()
    const users = db.collection('users')

    const isUserExist = await users.findOne({ email })
    if (isUserExist) {
      res.render('registration', { theme: req.cookies.theme ?? 'light', error: 'User already exists' });
      return;
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser = {
      name,
      email,
      password: hashedPassword
    };

    await users.insertOne(newUser)
    res.redirect('/auth/login')
  } catch (err) {
    console.error('Error loading users:', err);
    next(err);
  }
}

// Logout controller
const getLogoutHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/login');
  }
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie('connect.sid');
    res.clearCookie('theme');

    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
    });

    res.redirect('/');
  });
};

export { getLoginHandler, postLoginHandler, getRegisterHandler, postRegisterHandler, getLogoutHandler }