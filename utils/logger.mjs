function logRequests(req, res, next) {
  console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
  if (req.body) {
    console.log(`${new Date().toISOString()} - Request body: ${JSON.stringify(req.body)}`);
  }

  next();
}

export default logRequests