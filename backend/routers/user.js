const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const passwordCheck = require('../middlewares/checkPassword');


router.post('/signup',passwordCheck, userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;