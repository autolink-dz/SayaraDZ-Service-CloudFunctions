const fabricants = require("express").Router()
const controller = require("./controller")


fabricants.get("/",controller.getCarProviders);

fabricants.get("/:ID_FABRIQUANT",controller.getCarProvider);

fabricants.put("/:ID_FABRIQUANT",controller.updateCarProvider)

fabricants.delete("/:ID_FABRIQUANT",controller.deleteCarProvider)

module.exports = fabricants;