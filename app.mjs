import express from 'express'
import router from './routes/index.mjs'
import logRequests from './utils/logger.mjs'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
import errorHandler from './error/error.mjs'
import './utils/passport.mjs'
import dotenv from 'dotenv'
import fs from 'fs'
import https from 'https'
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit'
import MongoStore from 'connect-mongo'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later!',
})

const certOptions = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.cert')
};

dotenv.config()

const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: true,
    httpOnly: true,
    sameSite: 'lax'
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI, // URL для подключения к MongoDB
    dbName: process.env.DB_NAME, // Имя базы данных
    collectionName: 'sessions', // Название коллекции в MongoDB
    ttl: 30 * 24 * 60 * 60, // Время жизни сессии (30 дней)
    autoRemove: 'native', // Автоматическое удаление просроченных сессий
  })
}

const PORT = process.env.PORT || 3000
const HTTPS_PORT = process.env.HTTPS_PORT || 8443
const app = express()
const httpApp = express()

httpApp.get('*', (req, res) => {
  res.redirect(`https://${req.hostname}:${HTTPS_PORT}${req.url}`)
});

app.use(limiter)
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://www.google.com", 'https://www.gstatic.com'],
      imgSrc: ["'self'", 'https:'],
      styleSrc: ["'self'"],
      frameSrc: ["'self'", "https://www.google.com"]
    }
  }
}));
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}));
app.use(cors())

app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static('public'))

app.use(cookieParser())
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))

app.use(logRequests)

app.use(session(sessionOptions))
app.use(passport.initialize())
app.use(passport.session())

app.use(router)

app.use(errorHandler)

httpApp.listen(PORT, () => {
  console.log(`HTTP Server is running on http://localhost:${PORT}`)
})

https.createServer(certOptions, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS Server is running on https://localhost:${HTTPS_PORT}`)
})