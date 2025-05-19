const express = require('express');
const router = express.Router();
const {
  UACreateUserAccountController,
  UAViewUserAccountController,
  UAUpdateUserAccountController,
  UADeleteUserAccountController,
  UASearchUserAccountController
} = require('../controllers/UserManagementController');

router.post('/', UACreateUserAccountController.createUserAccount);
router.get('/all', UAViewUserAccountController.viewUserAccount);
router.put('/:username', UAUpdateUserAccountController.updateUserAccount);
router.delete('/:username', UADeleteUserAccountController.deleteUserAccount);
router.get('/', UASearchUserAccountController.searchUserAccount);
  
module.exports = router;
