const express = require('express');
const router = express.Router();
const {addDisease,getDiseases} = require('../controllers/DiseaseController');
const upload = require('../config/multerConfig');

router.post('/addDisease',upload.single('file'),addDisease);
router.get('/getDiseases',getDiseases)

module.exports = router;