var express = require('express');
var router = express.Router();
var seasonApi = require('../api/seasonalActivity');
var covenantApi = require('../api/covenantDetails');
var util = require('../controllers/utilities');
var jwt = require('express-jwt');
var jwksRsa = require('jwks-rsa');
var jwtAuthz = require('express-jwt-authz');

/* set up authentication controls */
// Authentication middleware. When used, the access token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
    // Dynamically provide a signing key based on the kid in the header and 
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://hopshackle.eu.auth0.com/.well-known/jwks.json`
    }),
    audience: 'arsmagica.uk',
    issuer: `https://hopshackle.eu.auth0.com/`,
    algorithms: ['RS256']
});

var logStatus = function(req, res, next) {
    console.log(req.user);
    next();
}

// First we check access rights (currently set at covenant level)
// These call next(), so will pass control back here so post-authorisation
// we fall through to the actual api call
router.put('/foedus/:magus/:seasonID', checkJwt, logStatus, jwtAuthz(['update:foedus']));
router.post('/foedus/:magus', checkJwt, logStatus, jwtAuthz(['update:foedus']));

router.put('/aoide/:magus/:seasonID', checkJwt, logStatus, jwtAuthz(['update:aoide']));
router.post('/aoide/:magus', checkJwt, logStatus, jwtAuthz(['update:aoide']));

/* Responsible for routing to core api calls */
router.get('/:covenant', covenantApi.covenantData);  // all data for a given covenant
router.put('/:covenant', covenantApi.updateCovenant); // modify a given record
router.post('/', covenantApi.addCovenant); // add details of a new covenant
router.get('/', covenantApi.listAllCovenants);  // get list of all covenants

router.get('/:cov/:magus', seasonApi.getSeasonData);  // all data for a given magu
router.put('/:cov/:magus/:seasonID', seasonApi.updateSeason); // modify a given record
router.delete('/:cov/:magus/:seasonID', seasonApi.deleteSeason); // delete a given record
router.post('/:cov/:magus', seasonApi.addSeason); // add details of a new season

// if we get here, then an error has occurred, as the api call is not supported
router.all('/', function (req, res) {
    util.sendJsonResponse(res, 405, { "message": "API call not supported" });
});

module.exports = router;
