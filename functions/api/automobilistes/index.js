const automobilistes = require("express").Router()
const controller = require("./controller")


automobilistes.get("/:UID",controller.getCarDriver);


module.exports = automobilistes;