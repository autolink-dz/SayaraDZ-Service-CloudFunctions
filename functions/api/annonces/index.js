const annonces = require("express").Router()
const controller = require("./controller")

annonces.post("/",controller.setAnnounce);

annonces.get("/",controller.getAnnounces);

annonces.get("/:ID_ANNONCE",controller.getAnnounce);

module.exports = annonces;