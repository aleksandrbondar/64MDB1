import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { connectDB } from '../db.mjs'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'

passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const db = await connectDB()

      const user = await db.collection('users').findOne({ email })
      if (!user) {
        return done(null, false, { message: 'Invalid data' });
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return done(null, false, { message: 'Invalid login or password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = await connectDB()
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) })

    if (!user) {
      return done(null, false, { message: 'Invalid data' });
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
});