const modeles = require("express").Router()
const controller = require("./controller")


modeles.post("/",controller.setModel);

modeles.get("/",controller.getModels);

modeles.get("/:ID_MODELE",controller.getModel);

modeles.put("/:ID_MODELE",controller.updateModel)

modeles.delete("/:ID_MODELE",controller.deleteModel)


module.exports = modeles;