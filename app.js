require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mainRouter = require("./routes/index");
const errorHandler = require('./middlewares/error-handling');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db').then(() => {
  // console.log("Connected to DB");
}).catch( /* console.error() */ );

app.use(express.json())

const corsOptions = {
  origin: 'https://alphawtwr.crabdance.com',
  credentials: true,
};
app.use(cors(corsOptions));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use(requestLogger);
app.use('/', mainRouter);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
