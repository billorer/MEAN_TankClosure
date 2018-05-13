//importing modules
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const config = require('./config/database');
const http = require('http');

var app = express();
var server = http.createServer(app);

//const route = require('./routes/route');
const users = require('./routes/users');
const options = require('./routes/options');

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

//app.use('/api', route);
app.use('/user', users);
app.use('/option', options);

//port number
const port = process.env.PORT || 3000;

// Index Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint!');
});

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// Start the server
server.listen(port, () => {
    console.log("Server started at port: " + port);
});

// Create socketIO object
const io = require('socket.io')(server, {wsEngine: 'ws'});
module.exports = io;
const socketLobby = require('./socketio/lobbyIO');
const socketGame = require('./socketio/gameIO');
