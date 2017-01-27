
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
        Season.find({ magus: magus }, function (err, records) {
            if (err) util.sendJsonResponse(res, 400, err);
            util.sendJsonResponse(res, 200, records);
        });
    },
    updateSeason: function (req, res) {
        // modify a given record
        // first we verify that the magus parameter is compatible with the seasonal activity
        Season.findById(req.params.seasonID)
            .exec(function (err, recordToUpdate) {
                if (err) util.sendJsonResponse({ message: "Season ID not found" }, 404, err);
                if (recordToUpdate.magus === req.params.magus) {
                    // we never change year, season or magus on an existing record
                    console.log(req.body);
                    recordToUpdate.description = req.body.description;
                    recordToUpdate.isService = req.body.isService;
                    recordToUpdate.itemsUsed = convertItemsUsed(req.body.itemsUsed);
                    recordToUpdate.serviceForMagus = req.body.serviceForMagus;
                    console.log(recordToUpdate);
                    recordToUpdate.save(function (err, updatedRecord) {
                        if (err) util.sendJsonResponse({ message: "Unexpected error saving changes" }, 400, err);
                        util.sendJsonResponse(res, 200, updatedRecord);
                    });
                } else {
                    util.sendJsonResponse({ message: "Incorrect Magus for season" }, 400, err);
                }

            });
    },
    deleteSeason: function (req, res) {
        // delete a given record
    },
    addSeason: function (req, res) {
        var newSeason = createCompliantObjectFrom(req);
        Season.create(newSeason, function (err, newRecord) {
            if (err) util.sendJsonResponse(res, 400, err);
            util.sendJsonResponse(res, 200, newRecord);
        });
    }

}

