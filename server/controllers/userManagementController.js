const UserAccount = require('../entities/UserAccount');
const UserProfile = require('../entities/UserProfile');

class UACreateUserAccountController {
  async createUserAccount(req, res) {
    const { username, password, profilename, firstname,lastname, email , phone } = req.body;

    try {
      const success = await UserAccount.createUserAccount(username, password, profilename, firstname,lastname, email , phone);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(400).json({ success: false });
      }
    } catch (err) {
      console.error('Error creating user(runtime error):', err);
      res.status(500).json({ success: false });
    }
  }
}

class UAViewUserAccountController {
  async viewUserAccount(req, res) {
    try {
      const Users = await UserAccount.viewUserAccount();
      return res.json(Users);
    } catch (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

class UAUpdateUserAccountController {
  async updateUserAccount(req, res) {
    const username = req.params.username;
    const updatedData = req.body;
    try {
      const success = await UserAccount.updateUserAccount(username, updatedData);
      res.json({ success });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  }
}

class UADeleteUserAccountController {
  async deleteUserAccount(req, res) {
    const username = req.params.username;
    // debugging
    console.log('Deleting user:', username);
    try {
      const success = await UserAccount.deleteUserAccount(username);
      res.json({ success });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  }
}

class UASearchUserAccountController {
  async searchUserAccount(req, res) {
    const firstname = req.query.firstname || '';

    try {
      const Users = await UserAccount.searchUserAccount(firstname);
      return res.json(Users);
    } catch (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

class UACreateUserProfileController {
  async createUserProfile(req, res) {
    const { profilename, profiletype, profiledescription } = req.body;
    try {
      const success = await UserProfile.createUserProfile(profilename, profiletype, profiledescription);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(400).json({ success: false});
      }
    } catch (err) {
      console.error('Error creating profile(runtime error):', err);
      res.status(500).json({ success: false });
    }
  }
}

class UAViewUserProfileController {
  async viewUserProfile(req, res) {
    try {
      const profileNames = await UserProfile.viewUserProfile();
      res.json(profileNames);
    } catch (err) {
      console.error('Error fetching profile names:', err);
      res.status(500).json({ error: 'Failed to fetch profile names' });
    }
  }  
}

class UAUpdateUserProfileController {
  async updateUserProfile(req, res) {
    const profilename = req.params.profilename;
    const updatedData = req.body;
    try {
      const success = await UserProfile.updateUserProfile(profilename, updatedData);
      res.json({ success });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  }
}

class UADeleteUserProfileController {
  async deleteUserProfile(req, res) {
    const profilename = req.params.profilename;
    // debugging
    console.log('Deleting profile:', profilename);
    try {
      const success = await UserProfile.deleteUserProfile(profilename);
      res.json({ success });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  }
}

class UASearchUserProfileController {
  async searchUserProfile(req, res) {
    const profilename = req.query.profilename || '';
    try {
      const profileNames = await UserProfile.searchUserProfile(profilename);
      res.json(profileNames);
    } catch (err) {
      console.error('Error fetching profile names:', err);
      res.status(500).json({ error: 'Failed to fetch profile names' });
    }
  }  
}

module.exports = {
  UACreateUserAccountController: new UACreateUserAccountController(),
  UAViewUserAccountController: new UAViewUserAccountController(),
  UAUpdateUserAccountController: new UAUpdateUserAccountController(),
  UADeleteUserAccountController: new UADeleteUserAccountController(),
  UASearchUserAccountController: new UASearchUserAccountController(),
  UACreateUserProfileController: new UACreateUserProfileController(),
  UAViewUserProfileController: new UAViewUserProfileController(),
  UAUpdateUserProfileController: new UAUpdateUserProfileController(),
  UADeleteUserProfileController: new UADeleteUserProfileController(),
  UASearchUserProfileController: new UASearchUserProfileController()
};

