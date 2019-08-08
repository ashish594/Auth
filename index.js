const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const routes = require('./routes');
const mongoose = require('mongoose');


//DB setup
mongoose.connect('mongodb://localhost:auth/auth', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.on("connected", function() {
    console.log("connected to db");
});

// App setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
routes(app);


// Server setup
const port = process.env.port || 3090; //If you define a port on env file, then express app runs on that port else default to 3090
const server = http.createServer(app);  // receives all the HTTP requests and send to them ti our express server app
server.listen(port);
console.log(`listening on port: ${port}`);
