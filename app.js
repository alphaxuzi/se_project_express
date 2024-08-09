const express = require('express');
const mongoose = require('mongoose');
const mainRouter = require("./routes/index.js")

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db').then(() => {
  console.log("Connected to DB")
}).catch(console.error());

app.use(express.json())
app.use('/', mainRouter);

app.get('/', (req, res) => {
  res.send('hello')
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
