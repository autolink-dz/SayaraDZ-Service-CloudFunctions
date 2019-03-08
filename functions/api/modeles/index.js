const modeles = require("express").Router()
const controller = require("./controller")
const versions  = require("./../versions")

modeles.use("/:ID_MODELE/versions",(req,res,next)=>{
    req.ID_MODELE = req.params.ID_MODELE
    next()
},versions)

modeles.get("/",controller.getModels);

modeles.get("/:ID_MODELE",controller.getModel);

modeles.post("/",controller.setModel);

modeles.put("/:ID_MODELE",controller.updateModel)

modeles.delete("/:ID_MODELE",controller.deleteModel)


module.exports = modeles;