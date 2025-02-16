const express = require('express');

const router = express.Router();
const {getDiseases} = require('../controllers/PatientDiseases');

router.get('/getDiseases',getDiseases)


module.exports = router