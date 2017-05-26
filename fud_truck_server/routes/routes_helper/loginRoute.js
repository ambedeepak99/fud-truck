/**
 * Created by deepak on 5/24/2017.
 */

var express = require('express');
var router = express.Router();

var loginCtrl = require('../../app_modules/login/loginCtrl');

router.post('/signin', loginCtrl.login);
router.post('/signup', loginCtrl.signUp);


_logger.debug("login route initialized");

module.exports = router;