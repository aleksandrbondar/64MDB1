function errorHandler(error, req, res, next) {
  res.status(error.status || 500)
  res.json({
    error: {
      status: error.status,
      message: error.message
    }
  })
  next();
}

export default errorHandler