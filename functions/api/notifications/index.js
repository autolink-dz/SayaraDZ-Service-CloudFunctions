const notifications = require("express").Router()
const controller = require("./controller")


notifications.post("/tokens/:ID",controller.setNotificationToken);

notifications.post("/:TYPE/:ID",controller.setSubscrptionState);

notifications.delete("/:TYPE/:ID",controller.setSubscrptionState);


module.exports = notifications;