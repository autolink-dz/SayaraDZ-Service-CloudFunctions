const admin = require("express").Router()
const adminSdk  =require("firebase-admin")

admin.get("/",(req,res)=>{
    var token = req.token || req.headers.authorization.split('Bearer ')[1] ||
    console.log(token);
    adminSdk.auth().verifyIdToken(token)
            .then((decodedToken)=>{
                var uid = decodedToken.uid;
                res.json({admin: decodedToken.admin || false}).status(200)
                return 0;
            }).catch((error)=>{
                res.json({}).status(500)
                return 0;
            });            

});

module.exports = admin;