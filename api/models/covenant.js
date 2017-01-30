var mongoose = require("mongoose");

var itemSchema = new mongoose.Schema({
    name: {type: String, require: true},
    type: {type: String, require: true, enum: ['Summa', 'Tractatus', 'Other']},
    author: String,
    description: String
});

var covenantSchema = new mongoose.Schema({
    name: {type: String, require : true},
    members: [String],
    description: String,
    items: [itemSchema]
});

var Covenant = mongoose.model('Covenant', covenantSchema);

module.exports = Covenant;