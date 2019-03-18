const vehicule = require("express").Router()
const controller = require("./controller")


vehicule.get("/:ID_MARQUE",controller.getCars);


module.exports = vehicule;