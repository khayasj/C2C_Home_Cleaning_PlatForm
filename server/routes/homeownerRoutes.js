const express = require('express');
const router = express.Router();

// Correctly destructure the exported object
const {
    HomeownerViewServiceController,
    HomeownerSearchServiceController,
    HomeownerViewShortlistController,
    HomeownerSearchShortlistController,
    HomeownerViewHistoryController,
    HomeownerSearchHistoryController,
} = require('../controllers/HomeownerManagementController');


// Routes for Service Management
router.get('/view', HomeownerViewServiceController.viewService); 
router.get('/search', HomeownerSearchServiceController.searchService);

// Routes for Shortlist Management
router.get('/shortlist/view', HomeownerViewShortlistController.viewShortlist);
router.get('/shortlist/search', HomeownerSearchShortlistController.searchShortlist);

// Routes for Past Matches History
router.get('/history/all', HomeownerViewHistoryController.viewServiceHistory);
router.get('/history/:homeownerusername', HomeownerSearchHistoryController.searchServiceHistory);

module.exports = router;
