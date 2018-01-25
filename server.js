const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const router = require('./routes/api.js');
const http = require('http');
const app = express();
const yelp = require('yelp-fusion');
var dburl = process.env.MONGOURI || 'mongodb://localhost/freecodecampnightlifecoordination';
const port = Number(process.env.PORT || 8080);
const passport=require('passport');
const social=require('./routes/passport')(app,passport);
mongoose.connect(dburl , function (err) {
    if (err) {
        console.log(err);
    }
});

mongoose.connection.on('connected', function () {
    console.log('Connected');
});

mongoose.connection.on('disconnected', function () {
    console.log('Disconnected');
})
mongoose.connection.on('error', function () {
    console.log('An has occurred');
});


app.use(passport.initialize());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));
app.use(router);
app.get('*', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, function () {
  console.log('Listening on port: ' + port);
})
