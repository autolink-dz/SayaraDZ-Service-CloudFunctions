const automobilistes = require("express").Router()
const controller = require("./controller")

/**
 * get the the car driver object
 */
automobilistes.get("/:UID",controller.getCarDriver);


module.exports = automobilistes;