
var Covenant = require('./models/covenant');
var util = require('../controllers/utilities');

module.exports = {

    covenantData: function (req, res) {
        // all data for a given magus
        var covenant = req.params.covenant;
        Covenant.find({ name: covenant }, function (err, records) {
            if (err || records.length == 0) {
                util.sendJsonResponse(res, 400, err);
            } else {
                util.sendJsonResponse(res, 200, records);
            }
        });
    },
    updateCovenant: function (req, res) {
        // modify a given record
        Covenant.find({ name: covenant })
            .exec(function (err, records) {
                if (err) {
                    return util.sendJsonResponse(res, 404, err);
                }
                if (!records || records.length == 0) {
                    return util.sendJsonResponse(res, 400, { message: "Covenant does not exist" });
                }
                var recordToUpdate = records[0];
                recordToUpdate.name = req.body.name;
                recordToUpdate.description = req.body.description;
                recordToUpdate.members = convertToArray(req.body.members, "|");
                recordToUpdate.save(function (err, updatedRecord) {
                    if (err) {
                        return util.sendJsonResponse(res, 400, err);
                    }
                    return util.sendJsonResponse(res, 200, updatedRecord);
                });
            });
    },
    addCovenant: function (req, res) {
        var newCovenant = {
            name: req.body.name,
            description: req.body.description,
            members: convertToArray(req.body.members, "|")
        };
        Season.create(newSeason, function (err, newRecord) {
            if (err) return util.sendJsonResponse(res, 400, err);
            return util.sendJsonResponse(res, 200, newRecord);
        });
    }

}

