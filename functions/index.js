const functions = require("firebase-functions");
const admin  = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");

const cors  = require("cors")


// cloud functions modules
const auth  = require('./auth');
const api  = require('./api/api');
const onCarDriverCreated = require("./tirggers/authentication/onCarDriverCreated")
const createThumbnail = require("./tirggers/storage/createThumbnail")
const processPricesCsvFile = require("./tirggers/storage/processPricesCsvFile")
const processCarsCsvFile = require("./tirggers/storage/processCarsCsvFile")
const databaseOrdersTriggers = require("./tirggers/database/commandes")
const databaseCarProviderTriggers = require("./tirggers/database/fabricants")
const databaseBrandTriggers = require("./tirggers/database/marques")
const databaseModelsTriggers = require("./tirggers/database/modeles")
const databaseOffersTriggers = require("./tirggers/database/offres")


//intialize the firebase admin sdk
admin.initializeApp(functions.config().firebase);
const app = express();

//Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Authentication middlware.
app.use(auth);
app.use("/api/v1",api);

/**
 * SayaraDZ web api module
 */
exports.sayaraDzApi = functions.https.onRequest(app);


/**
 * SayaraDZ authentication triggers module
 */
exports.authenticationTrigger = functions.auth.user().onCreate((user) => {
    console.log("a new user is created with "+user.providerData[0].providerId)
    
    return user.providerData[0].providerId == "password" ? 0: onCarDriverCreated(user);
});


/**
 * SayaraDZ resources upload triggers module
 */
exports.storageTrigger = functions.storage.object().onFinalize((object)=>{
    if (object.name.startsWith('images/')) 
        return createThumbnail(object)
    else if (object.name.startsWith('csv/tarifs')) 
        return processPricesCsvFile(object)
    else if (object.name.startsWith('csv/stocks')) 
        return processCarsCsvFile(object)
    else
        return 0

})

/**
 * SayaraDZ database triggers modules
 */
exports.onOrderCreated = databaseOrdersTriggers.onOrderCreated
exports.onOrderUpdated = databaseOrdersTriggers.onOrderUpdated
exports.onCarProviderUpdated =  databaseCarProviderTriggers.onCarProviderUpdated
exports.onBrandDeleted = databaseBrandTriggers.onBrandDeleted
exports.onModelDeleted = databaseModelsTriggers.onModelDeleted
exports.onModelDeleted = databaseModelsTriggers.onModelDeleted
exports.onOfferCreated = databaseOffersTriggers.onOfferCreated
exports.onOfferUpdated = databaseOffersTriggers.onOfferUpdated