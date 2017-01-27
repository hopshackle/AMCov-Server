
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
            if (err) {
                util.sendJsonResponse(res, 400, err);
            } else {
                util.sendJsonResponse(res, 200, records);
            }
        });
    },
    updateSeason: function (req, res) {
        // modify a given record
        // first we verify that the magus parameter is compatible with the seasonal activity
        Season.findById(req.params.seasonID)
            .exec(function (err, recordToUpdate) {
                if (err) {
                    util.sendJsonResponse(res, 404, err);
                    return;
                }
                if (!recordToUpdate) {
                    util.sendJsonResponse(res, 400, { message: "Activity for season does not exist" });
                    return;
                }
                if (recordToUpdate.magus === req.params.magus) {
                    // we never change year, season or magus on an existing record
                    recordToUpdate.description = req.body.description;
                    recordToUpdate.isService = req.body.isService;
                    recordToUpdate.itemsUsed = convertItemsUsed(req.body.itemsUsed);
                    recordToUpdate.serviceForMagus = req.body.serviceForMagus;
                    recordToUpdate.save(function (err, updatedRecord) {
                        if (err) {
                            util.sendJsonResponse(res, 400, err);
                            return;
                        }
                        return util.sendJsonResponse(res, 200, updatedRecord);
                    });
                } else {
                    return util.sendJsonResponse(res, 400, { message: "Incorrect Magus for seasonal activity" });
                }

            });
    },
    deleteSeason: function (req, res) {
        // delete a given record
        Season.findById(req.params.seasonID)
            .exec(function (err, recordToRemove) {
                if (err) return util.sendJsonResponse(res, 404, err);
                if (!recordToRemove) return util.sendJsonResponse(res, 400, { message: "Activity for season does not exist" });
                if (recordToRemove.magus === req.params.magus) {
                    console.log(recordToRemove);
                    recordToRemove.remove(function (err, updatedRecord) {
                        if (err) return util.sendJsonResponse(res, 400, err);
                        return util.sendJsonResponse(res, 200, updatedRecord);
                    });
                } else {
                    return util.sendJsonResponse(res, 400, { message: "Incorrect Magus for seasonal activity" });
                }

            });
    },
    addSeason: function (req, res) {
        var newSeason = createCompliantObjectFrom(req);
        Season.create(newSeason, function (err, newRecord) {
            if (err) return util.sendJsonResponse(res, 400, err);
            return util.sendJsonResponse(res, 200, newRecord);
        });
    }

}

