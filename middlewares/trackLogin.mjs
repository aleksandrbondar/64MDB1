import { connectDB } from './../db.mjs';

async function trackLoginAttemptMiddleware(req, res, next) {
  const userIp = req.ip;
  const email = req.body.email;
  const currentTime = new Date();

  const db = await connectDB();
  const loginAttemptsCollection = db.collection('loginAttempts');
  let attempt;

  if (email !== undefined) {
    attempt = await loginAttemptsCollection.findOne({ user_email: email });
  } else if (userIp !== '::1') {
    attempt = await loginAttemptsCollection.findOne({ user_ip: userIp });
  } else {
    attempt = await loginAttemptsCollection.findOne({ user_ip: 'unknown' });
  }

  if (attempt) {
    const diff = currentTime - attempt.lastAttempt

    if (diff < 15 * 60 * 1000) {
      if (attempt.attempts > 3) {
        return res.status(403).send(`Too many login attempts. Try again after ${new Date(attempt.lastAttempt).getMinutes() * 15} minutes.`);
      }

      await loginAttemptsCollection.updateOne(
        { _id: attempt._id },
        {
          $set: {
            attempts: attempt.attempts + 1,
            lastAttempt: currentTime,
          },
        }
      );
    }

    if (diff > 15 * 60 * 1000) {
      await loginAttemptsCollection.updateOne(
        { _id: attempt._id },
        {
          $set: {
            attempts: 1,
            lastAttempt: currentTime,
          },
        }
      );
    }
  } else {
    await loginAttemptsCollection.insertOne({
      user_email: email !== undefined ? email : 'unknown',
      user_ip: userIp !== '::1' ? userIp : 'unknown',
      attempts: 1,
      lastAttempt: currentTime,
    });
  }

  next();
}

export default trackLoginAttemptMiddleware;