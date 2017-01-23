
var Season = require('./models/season');
var util = require('../controllers/utilities');

function convertItemsUsed(items) {
    if (items) return items.split(",");
    return items;
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
        // all data for a given magus
        var magus = req.params.magus;
        Season.find({magus: magus}, function(err, records) {
            if (err) util.sendJsonResponse(res, 400, err);
            util.sendJsonResponse(res, 200, records);
        });
    },
    updateSeason: function (req, res) {
        // modify a given record
    },
    deleteSeason: function (req, res) {
        // delete a given record
    },
    addSeason: function (req, res) {
        var newSeason = createCompliantObjectFrom(req);
        Season.create(newSeason, function(err, newRecord) {
            if (err) util.sendJsonResponse(res, 400, err);
            util.sendJsonResponse(res, 200, newRecord);
        });
    }

}

