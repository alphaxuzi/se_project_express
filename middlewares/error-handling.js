const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err);

  res
    .status(statusCode)
    .send({
      message:
        statusCode === 500
          ? `An error has occurred on the server`
          : err.message,
    });
};

module.exports = errorHandler;