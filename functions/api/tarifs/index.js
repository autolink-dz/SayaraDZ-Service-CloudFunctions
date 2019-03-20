const tarifs = require("express").Router()
const controller = require("./controller")

tarifs.get("/:ID_MARQUE/:CODE_MODELE/versions/:CODE",(req,res,next)=>{
    req.type  = "version"
    next()
},controller.getPrice);

tarifs.get("/:ID_MARQUE/:CODE_MODELE/couleurs/:CODE",(req,res,next)=>{
    req.type  = "couleur"
    next()
},controller.getPrice);

tarifs.get("/:ID_MARQUE/:CODE_MODELE/options/:CODE",(req,res,next)=>{
    req.type  = "option"
    next()
},controller.getPrice);




module.exports = tarifs;