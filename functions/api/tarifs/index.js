const tarifs = require("express").Router()
const controller = require("./controller")

tarifs.get("/:ID_MARQUE/:CODE_MODELE/versions/:CODE",(req,res,next)=>{
    req.type  = "0"
    next()
},controller.getPrice);

tarifs.get("/:ID_MARQUE/:CODE_MODELE/couleurs/:CODE",(req,res,next)=>{
    req.type  = "1"
    next()
},controller.getPrice);

tarifs.get("/:ID_MARQUE/:CODE_MODELE/options/:CODE",(req,res,next)=>{
    req.type  = "2"
    next()
},controller.getPrice);




module.exports = tarifs;