const offres = require("express").Router()
const controller = require("./controller")

offres.post("/",controller.setOffer);

offres.put("/:ID_OFFRE",controller.updateOffer)

module.exports = offres;