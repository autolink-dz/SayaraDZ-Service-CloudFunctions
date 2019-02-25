const marques = require("express").Router()
const controller = require("./controller")


marques.get("/",controller.getBrands);

marques.get("/:ID_MARQUE",controller.getBrand);

marques.post("/",controller.setBrand);

marques.put("/:ID_MARQUE",controller.updateBrand)

marques.delete("/:ID_MARQUE",controller.deleteBrand)

module.exports = marques;