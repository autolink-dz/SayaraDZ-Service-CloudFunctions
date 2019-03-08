const functions = require("firebase-functions");
const admin  = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");

const cors  = require("cors")


// cloud functions modules
const auth  = require('./auth');
const api  = require('./api/api');
const onCarDriverCreated = require("./tirggers/authentication/onCarDriverCreated")

//intialize the firebase admin sdk
admin.initializeApp(functions.config().firebase);
const app = express();

//Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Authentication middlware.
//app.use(auth);
app.use("/api/v1",api);

/**
 * SayaraDZ web api module
 */
exports.sayaraDzApi = functions.https.onRequest(app);


/**
 * SayaraDZ authentication triggers module
 */
exports.authenticationTrigger = functions.auth.user().onCreate((user) => {

    return user.providerData[0].providerId != "password" ? 0: onCarDriverCreated(user);
});
