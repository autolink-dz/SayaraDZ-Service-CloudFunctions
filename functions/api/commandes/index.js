const commandes = require("express").Router()
const controller = require("./controller")

commandes.post("/",controller.setOrder);

commandes.get("/",controller.getOrders);

commandes.get("/:ID_COMMANDE",controller.getOrder);

commandes.put("/:ID_COMMANDE",controller.updateOrder);

commandes.delete("/:ID_COMMANDE",controller.deleteOrder);
