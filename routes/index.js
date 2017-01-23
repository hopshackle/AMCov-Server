var express = require('express');
var router = express.Router();
var control = require('../controllers/control');

/* Responsible for routing apart from the core api calls */
router.get('/', control.covenantCntrl);
router.get('/:covenantID', control.covenantCntrl);

module.exports = router;
