
var Season = require('./models/season');
var util = require('../controllers/utilities');

function convertItemsUsed(items) {
    if (items) return items.split(",");
    return ""
}

function createCompliantObjectFrom(req) {
    return {
        year: parseInt(req.body.year),
        season: parseInt(req.body.season),
        magus: req.body.magus,
        description: req.body.description,
        isService: req.body.isService,
        itemsUsed: convertItemsUsed(req.body.itemsUsed),
        serviceForMagus: req.body.serviceForMagus
    }
}

module.exports = {

    covenantData: function (req, res) {
        // all data for a gven covenant
    },
    updateSeason: function (req, res) {
        // modify a given record
    },
    deleteSeason: function (req, res) {
        // delete a given record
    },
    addSeason: function (req, res) {
        Season.create(createCompliantObjectFrom(req), function(err, newRecord) {
            if (err) util.sendJsonResponse(res, 400, err);
            util.sendJsonResponse(res, 200, newRecord);
        });
    }

}

