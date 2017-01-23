var mongoose = require("mongoose");

var seasonSchema = new mongoose.Schema({
    year: {type: Number, min:1220, max:1500, require: true},
    season: {type: Number, min:1, max:4, require: true},
    magus: {type: String, require: true},
    description: String,
    isService: {type: Boolean, default: false},
    itemsUsed: [String],
    serviceForMagus: String
});

var Season = mongoose.model('Season', seasonSchema);

module.exports = Season;
