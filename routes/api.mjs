import { Router } from 'express'
import { setThemeHandler, deleteCommentHandler, postCommentHandler, patchCommentHandler } from '../controllers/api.mjs'
import authMiddleware from '../middlewares/authMiddleware.mjs'

const apiRouter = Router()

apiRouter.route('/theme/:theme').get(setThemeHandler)
apiRouter.route('/comments/edit/:id').post(authMiddleware, patchCommentHandler)
apiRouter.route('/comments/delete/:id').get(authMiddleware, deleteCommentHandler)
apiRouter.route('/comments/add/:id').post(authMiddleware, postCommentHandler)

export default apiRouter