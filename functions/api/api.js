const express = require("express");
const fabricants = require('./fabricants/index');
const marques = require('./marques/index');
const admin = require('./admin/index');
const models = require('./modeles/index');

const api = express.Router();

api.use("/admin",admin);
api.use("/fabricants",fabricants);
api.use("/marques",marques);
api.use("/modeles",models);


module.exports = api