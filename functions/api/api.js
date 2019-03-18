const express    =  require("express");
const admin     = require('./admin/index');
const fabricants =  require('./fabricants/index');
const marques   = require('./marques/index');
const modeles   = require('./modeles/index');
const versions  = require('./versions/index');
const vehicules = require('./vehicules/index');
const commandes = require('./commandes/index');

const api = express.Router();

api.use("/admin",admin);
api.use("/fabricants",fabricants);
api.use("/marques",marques);
api.use("/modeles",modeles);
api.use("/versions",versions);
api.use("/vehicules",vehicules);
api.use("/commandes",commandes);

module.exports = api