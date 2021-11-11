const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const morgan = require('morgan');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const itemRoute = require('./routes/item');
const chartRoute = require('./routes/chart');
const mongoose = require('mongoose');
app.use(express.json()); //Used to parse JSON bodies
app.use(morgan('common')); //morgan to log server actions

//Connect to MongoDB
dotenv.config();
mongoose.connect(
  process.env.DB_CONNECT,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log('Connectd to db');
  }
);

app.get('/', (req, res) => {
  res.send(
    'Welcome to Sales-Dashboard. API is under construction. Pass by in future for latest updates'
  );
});

//users routes
app.use('/user', authRoute);

//items routes
app.use('/item', itemRoute);

//charts routes
app.use('/chart', chartRoute);

//Error handling
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('An error occur while loading');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('App listening on port 3000!');
});
