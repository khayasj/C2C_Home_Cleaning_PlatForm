const express = require('express');
const router = express.Router();
const {
  PACreateCategoryController,
  PAViewCategoryController,
  PAUpdateCategoryController,
  PADeleteCategoryController,
  PASearchCategoryController,
  PAGenerateDailyCategoryController,
  PAGenerateWeeklyCategoryController,
  PAGenerateMonthlyCategoryController
} = require('../controllers/PlatformAdminManagementController');

router.post('/', PACreateCategoryController.createServiceCategory);
router.get('/all', PAViewCategoryController.viewServiceCategory);
router.put('/:servicecategory', PAUpdateCategoryController.updateServiceCategory);
router.delete('/:servicecategory', PADeleteCategoryController.deleteServiceCategory);
router.get('/', PASearchCategoryController.searchServiceCategory);

router.get('/dailyreport', PAGenerateDailyCategoryController.generateDailyCategories);
router.get('/weeklyreport', PAGenerateWeeklyCategoryController.generateWeeklyCategories);
router.get('/monthlyreport', PAGenerateMonthlyCategoryController.generateMonthlyCategories);

module.exports = router;

