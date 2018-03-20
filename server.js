//importing modules
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const config = require('./config/database');

var app = express();

const route = require('./routes/route');
const users = require('./routes/users');

//connect to mongoDB
mongoose.connect(config.database);

//on connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database mongodb @ 27017');
});

//on error
mongoose.connection.on('error', (err) => {
    if(err){
        console.log('Error in Database connection: ' + err);
    }
});

//adding sessionMiddleware
app.use(cors());

//body-bodyparser
app.use(bodyparser.json());

//passport sessionMiddleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', route);
app.use('/user', users);

//port number
const port = 3000;

app.get('/', (req, res)=>{
    res.send('foobar');
});

app.listen(port, ()=>{
    console.log("Server started at port: " + port);
});
