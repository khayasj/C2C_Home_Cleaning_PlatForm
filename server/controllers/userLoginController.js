// controllers/userLoginController.js
const { verifyUserAccount } = require('../entities/UserAccount');
const { verifyUserProfile } = require('../entities/UserProfile');

class UserLoginController {
  async authenticateLogin(req, res) {
    const { username, password, profileType } = req.body;

    const accountStatus = await verifyUserAccount(username, password);  // Call Entity
    const profileStatus = await verifyUserProfile(username, profileType);  // Call Entity

    //just to check if the login attempt is correct
    console.log('Login attempt:', { username, password, profileType });
    console.log('Account verified:', accountStatus);
    console.log('Profile verified:', profileStatus);

    if (!accountStatus || !profileStatus)
      return res.status(401).json({ success: false });

    res.json({ success: true });
  }
}
module.exports = new UserLoginController();