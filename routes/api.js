var express = require('express');
var router = express.Router();
var api = require('../api/seasonalActivity');
var util = require('../controllers/utilities');

/* Responsible for routing to core api calls */

router.get('/:covenant', api.covenantData);  // all data for a gven covenant
router.put('/:covenant/:seasonID', api.updateSeason); // modify a given record
router.delete('/:covenant/:seasonID', api.deleteSeason); // delete a given record
router.post('/:covenant', api.addSeason); // add details of a new season

// if we get here, then an error has occurred, as the api call is not supported
router.all('/', function(req, res) {
    util.sendJsonResponse(res, 405, {"message": "API call not supported"});
});

module.exports = router;
