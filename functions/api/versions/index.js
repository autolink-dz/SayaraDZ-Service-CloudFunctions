const versions = require("express").Router()
const controller = require("./controller")

versions.get("/",controller.getVersions);

versions.get("/:ID_VERSION",controller.getVersion);

versions.post("/",controller.setVersion);

versions.put("/:ID_VERSION",controller.updateVersion)

versions.delete("/:ID_VERSION",controller.deleteVersion)

module.exports = versions;