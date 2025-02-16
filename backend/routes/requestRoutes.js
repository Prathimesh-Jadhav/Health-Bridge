const express = require('express');
const router = express.Router();
const { addRequest, getRequests, updateRequest } = require('../controllers/RequestsController');
const {authenticateUser} = require('../services/authentication');   

router.post('/addRequest',authenticateUser,addRequest);
router.get('/getRequests',getRequests);
router.post('/updateRequest',updateRequest);

module.exports = router;