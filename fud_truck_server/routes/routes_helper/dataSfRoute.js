/**
 * Created by deepak on 5/24/2017.
 */

var express = require('express');
var router = express.Router();

var dataSfCtrl = require('../../app_modules/dataSF/dataSfCtrl');

router.get('/getAllData', dataSfCtrl.getAllData);
router.get('/getCircleData/:distance', dataSfCtrl.getCircleData);

_logger.debug("dataSF route initialized");

module.exports = router;