const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const sauceCtrl = require('../controllers/sauce');

router.post('/', auth, multer, sauceCtrl.createYourSauce);
router.put('/:id', auth, multer, sauceCtrl.modifyYourSauce);
router.delete('/:id', auth, sauceCtrl.deleteYourSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/:id/like', auth, sauceCtrl.likeCtrl);

module.exports = router;
