require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require("passport");
const { User, Admin } = require('./middlewares/jwt');

const connectionUri = process.env.MONGO_LOCAL_CONN_URL;
let PORT = process.env.PORT;

const app = express();

//  Creating and configuring express app

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));

mongoose.promise = global.Promise;
mongoose.connect(connectionUri);

const connection = mongoose.connection;
connection.once('open', () => console.log("MongoDB connection established successfully"));
connection.on('error', (err) => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
});

// INITIALIZE PASSPORT MIDDLEWARE
app.use(passport.initialize());
require("./middlewares/jwt")(passport);

//Configure Route
require('./routes/index')(app);
app.listen(PORT, () => console.log('Server running on http://localhost:'+PORT+'/'));