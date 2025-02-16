const express = require('express');
const router = express.Router();
const { addHospital,getHospitals } = require('../controllers/hospitalController');

router.post('/addHospital',addHospital);
router.get('/getHospitals',getHospitals)

module.exports = router;