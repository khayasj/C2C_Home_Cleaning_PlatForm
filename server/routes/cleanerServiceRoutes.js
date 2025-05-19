const express = require('express');
const router = express.Router();
const {
    CleanerCreateServiceController,
    CleanerViewServiceController,
    CleanerUpdateServiceController,
    CleanerDeleteServiceController,
    CleanerSearchServiceController,
    CleanerViewServiceHistoryController,
    CleanerSearchServiceHistoryController
} = require('../controllers/CleanerManagementController');

router.post('/', CleanerCreateServiceController.createService);
router.get('/all/:cleanerusername', CleanerViewServiceController.viewService);
router.put('/:cleanerusername/:cleaningservicename', CleanerUpdateServiceController.updateService);
router.delete('/:cleanerusername/:cleaningservicename', CleanerDeleteServiceController.deleteService);
router.get('/:cleanerusername', CleanerSearchServiceController.searchService);

router.get('/history/all/:cleanerusername', CleanerViewServiceHistoryController.viewServiceHistory);
router.get('/history/:cleanerusername', CleanerSearchServiceHistoryController.searchServiceHistory);
  
module.exports = router;