const commandes = require("express").Router()
const controller = require("./controller")


/**
 * create a new order
 */
commandes.post("/",controller.setOrder);

/**
 * get the list of orders 
 */
commandes.get("/",controller.getOrders);

/**
 * get a single order object
 */
commandes.get("/:ID_COMMANDE",controller.getOrder);

/**
 * update an ordder object
 */
commandes.put("/:ID_COMMANDE",controller.updateOrder);


/**
 * delete an order object
 */
commandes.delete("/:ID_COMMANDE",controller.deleteOrder);

module.exports = commandes;