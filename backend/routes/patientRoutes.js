const express = require('express');
const router = express.Router();
const {addPatient,getPatients} = require('../controllers/PatientController');
const {authenticateUser} = require('../services/authentication');

router.post('/addPatient',authenticateUser, addPatient);
router.get('/getPatients', getPatients);

module.exports = router;