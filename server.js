//importing modules
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');

var app = express();

const route = require('./routes/route');

//connect to mongoDB
mongoose.connect('mongodb://localhost:27017/userlist');

//on connection
mongoose.connection.on('connected', ()=>{
    console.log('Connected to database mongodb @ 27017');
});

//on error
mongoose.connection.on('error', (err)=>{
    if(err){
        console.log('Error in Database connection: ' + err);
    }
});

//adding sessionMiddleware
app.use(cors());

//body-bodyparser
app.use(bodyparser.json());

//static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', route);

//port number
const port = 3000;

app.get('/', (req, res)=>{
    res.send('foobar');
});

app.listen(port, ()=>{
    console.log("Server started at port: " + port);
});
