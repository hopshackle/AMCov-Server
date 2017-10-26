
var Covenant = require('./models/covenant');
var util = require('../controllers/utilities');

module.exports = {

    covenantData: function (req, res) {
        // all data for a given covenant
        var covenant = req.params.covenant;
        Covenant.find({ name: covenant }, function (err, records) {
            if (err || records.length == 0) {
                return util.sendJsonResponse(res, 400, { message: "Covenant does not exist" });
            } else {
                util.sendJsonResponse(res, 200, records[0]);
            }
        });
    },
    listAllCovenants: function (req, res) {
        // a simple list of the available covenants
        Covenant.find({}, function (err, records) {
            if (err || records.length == 0) {
                util.sendJsonResponse(res, 400, err);
            } else {
                var list = [];
                for (var rec of records) {
                    list.push(rec.name);
                }
                util.sendJsonResponse(res, 200, list);
            }
        });
    },
    updateCovenant: function (req, res) {
        // modify a given record
        Covenant.find({ name: req.params.covenant })
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
                recordToUpdate.members = util.convertToArray(req.body.members, "|");
                recordToUpdate.items = util.convertToArray(req.body.items, "|");
                recordToUpdate.save(function (err, updatedRecord) {
                    if (err) {
                        return util.sendJsonResponse(res, 400, err);
                    }
                    return util.sendJsonResponse(res, 200, updatedRecord);
                });
            });
    },
    addCovenant: function (req, res) {
        Covenant.find({ name: req.body.name })
            .exec(function (err, records) {
                if (err) {
                    return util.sendJsonResponse(res, 404, err);
                }
                if (records && records.length > 0) {
                    return util.sendJsonResponse(res, 400, { message: "Covenant already exists" });
                } else {
                    var newCovenant = {
                        name: req.body.name,
                        description: req.body.description,
                        members: util.convertToArray(req.body.members, "|"),
                        items: util.convertToArray(req.body.items, "|")
                    };
                    Covenant.create(newCovenant, function (err, newRecord) {
                        if (err) return util.sendJsonResponse(res, 400, err);
                        return util.sendJsonResponse(res, 200, newRecord);
                    });
                }
            });
    },
    deleteCovenant: function (req, res) {
        var covenant = req.params.covenant;
        Covenant.findOneAndRemove({ name: covenant }, function (err, record) {
            if (err) {
                return util.sendJsonResponse(res, 404, err);
            }
            return util.sendJsonResponse(res, 200, record);
        });
    }
}

