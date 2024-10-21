import axios from 'axios';

const recaptchaMiddleware = async (req, res, next) => {
  const recaptchaResponse = req.body['g-recaptcha-response'];
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!recaptchaResponse) {
    return res.status(400).send('Capcha response is missing');
  }

  try {
    const verificationResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey,
          response: recaptchaResponse,
        },
      }
    );

    const { success } = verificationResponse.data;

    if (!success) {
      return res.status(400).send('Capcha validation failed');
    }

    next();
  } catch (error) {
    console.error('Error during capcha validation', error);
    return res.status(500).send('Internal server error');
  }
};

export default recaptchaMiddleware;