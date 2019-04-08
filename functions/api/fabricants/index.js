const fabricants = require("express").Router()
const controller = require("./controller")


/**
 * create a new car provider object 
 */
fabricants.post("/",controller.setCarProvider);

/**
 * get the list of the car providers
 */
fabricants.get("/",controller.getCarProviders);

/**
 * get the object of a car provider
 */
fabricants.get("/:ID_FABRIQUANT",controller.getCarProvider);


/**
 * update the object of a car provider
 */
fabricants.put("/:ID_FABRIQUANT",controller.updateCarProvider)

/**
 * delete the object of a car provider
 */
fabricants.delete("/:ID_FABRIQUANT",controller.deleteCarProvider)

module.exports = fabricants;