var mongoose = require('mongoose');
var speedMapData = mongoose.Schema({ any: Object });
var spdMap = mongoose.model("Speed_map",speedMapData);
module.exports.spdMap = spdMap;