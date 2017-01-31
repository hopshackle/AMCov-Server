var express = require('express');
var router = express.Router();
var seasonApi = require('../api/seasonalActivity');
var covenantApi = require('../api/covenantDetails');
var util = require('../controllers/utilities');

/* Responsible for routing to core api calls */

router.get('/:covenant', covenantApi.covenantData);  // all data for a given covenant
router.put('/:covenant', covenantApi.updateCovenant); // modify a given record
router.post('/', covenantApi.addCovenant); // add details of a new covenant

router.get('/:cov/:magus', seasonApi.getSeasonData);  // all data for a given magus
router.put('/:cov/:magus/:seasonID', seasonApi.updateSeason); // modify a given record
router.delete('/:cov/:magus/:seasonID', seasonApi.deleteSeason); // delete a given record
router.post('/:cov/', seasonApi.addSeason); // add details of a new season

// if we get here, then an error has occurred, as the api call is not supported
router.all('/', function(req, res) {
    util.sendJsonResponse(res, 405, {"message": "API call not supported"});
});

module.exports = router;
