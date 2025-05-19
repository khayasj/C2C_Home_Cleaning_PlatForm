const express = require('express');
const router = express.Router();

// Correctly destructure the exported object
const {
    HomeownerAddShortlistController,
    HomeownerRemoveShortlistController
} = require('../controllers/HomeownerManagementController');

router.post('/add', HomeownerAddShortlistController.addToShortlist);
router.post('/remove', HomeownerRemoveShortlistController.removeFromShortlist);

module.exports = router;