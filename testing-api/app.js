const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

const { Visitor } = require('./model/visitor');

const app = express();
app.use(bodyParser.json());
app.use(cors());

//connection goes here...
const connectDB = require('./config/db');
//load config
dotenv.config({path: './config/config.env'});
connectDB();


//router
app.use('/', require('./routes/index'));

const listener = app.listen(3000, () => {
  console.log(`server running on ${listener.address().port}`);
});
