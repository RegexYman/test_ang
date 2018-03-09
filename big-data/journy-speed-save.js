var mongoose = require('mongoose');
var journyData = mongoose.Schema({

});
var jSpeed = mongoose.model("Journy_speed",journyData);
module.exports.jSpeed = jSpeed;