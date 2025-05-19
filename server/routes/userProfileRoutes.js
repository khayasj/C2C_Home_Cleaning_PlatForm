const express = require('express');
const router = express.Router();
const {
  UACreateUserProfileController,
  UAViewUserProfileController,
  UAUpdateUserProfileController,
  UADeleteUserProfileController,
  UASearchUserProfileController
} = require('../controllers/UserManagementController');

router.post('/profilenames', UACreateUserProfileController.createUserProfile);
router.get('/view', UAViewUserProfileController.viewUserProfile);
router.put('/:profilename', UAUpdateUserProfileController.updateUserProfile);
router.delete('/:profilename', UADeleteUserProfileController.deleteUserProfile);
router.get('/profilenames', UASearchUserProfileController.searchUserProfile);

module.exports = router;