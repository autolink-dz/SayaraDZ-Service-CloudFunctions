const express = require("express");
const automobilistes  = require("./automobilistes/index");
const fabricants = require('./fabricants/index');
const marques = require('./marques/index');

const api = express.Router();

api.use("/automobilistes",automobilistes);
api.use("/fabricants",fabricants);
api.use("/marques",marques);


module.exports = api