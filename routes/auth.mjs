import { Router } from 'express'
import passport from 'passport'
import { getLoginHandler, getLogoutHandler, getRegisterHandler, postLoginHandler, postRegisterHandler } from '../controllers/auth.mjs'
import { csrfGet, csrfPost } from '../middlewares/csrf.mjs'
import captcha from '../middlewares/captcha.mjs'
import trackLoginAttemptMiddleware from '../middlewares/trackLogin.mjs'

const authRouter = Router()

authRouter.route('/login')
  .get(csrfGet, getLoginHandler)
  .post(trackLoginAttemptMiddleware, captcha, csrfPost, postLoginHandler, passport.authenticate('local'))

authRouter.route('/logout')
  .get(getLogoutHandler)

authRouter.route('/registration')
  .get(csrfGet, getRegisterHandler)
  .post(csrfPost, postRegisterHandler, passport.authenticate('local'))

export default authRouter