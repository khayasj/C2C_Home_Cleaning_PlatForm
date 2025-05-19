// entities/UserProfile.js
const db = require('../db');

class UserProfile {
  async verifyUserProfile(username, selectedProfileType) {
    // Step 1: Get the user’s stored profilename from useraccount
    const [userRows] = await db.query(
      'SELECT profilename FROM useraccount WHERE username = ?',
      [username]
    );
    if (userRows.length === 0) return false;
  
    const userProfilename = userRows[0].profilename;
  
    // Step 2: Look up the profiletype for that profilename
    const [profileRows] = await db.query(
      'SELECT profiletype FROM userprofile WHERE profilename = ?',
      [userProfilename]
    );
    if (profileRows.length === 0) return false;
  
    const storedProfileType = profileRows[0].profiletype;
  
    // Step 3: Compare with what the user selected during login
    return storedProfileType === selectedProfileType;
  }
  
  async createUserProfile(profilename,profiletype, profiledescription) { 
    const [existing] = await db.execute('SELECT * FROM userprofile WHERE profilename = ?', [profilename]);
    if (existing.length > 0) return false;
    
    await db.execute('INSERT INTO userprofile (profilename, profiletype, profiledescription) VALUES (?, ?, ?)', [
      profilename,
      profiletype,
      profiledescription
    ]);
    return true;
  }

  async viewUserProfile() {
    const [profileNames] = await db.execute(
      'SELECT * FROM userprofile'
    );
    return profileNames;
  }
  

  async updateUserProfile(profilename, updatedData) {
    // Check if profiletype is not selected properly
    if (!profiletype || profiletype === 'Select Profile Type') {
      console.log('Invalid profile type:', profiletype);
      return false;
    }
    
    const { profiletype, profiledescription } = updatedData;
    const [result] = await db.execute(
      'UPDATE userprofile SET profiletype = ?, profiledescription = ? WHERE profilename = ?',
      [profiletype, profiledescription, profilename]
    );
    return result.affectedRows > 0;
  }
  
  async deleteUserProfile(profilename) {
    const [result] = await db.execute('DELETE FROM userprofile WHERE profilename = ?',[profilename]);
    return result.affectedRows > 0;
  }

  async searchUserProfile(profilename) {
    const [profileNames] = await db.execute(
      'SELECT profilename, profiletype, profiledescription FROM userprofile WHERE profilename LIKE ?',
      [`%${profilename}%`]
    );
    return profileNames;
  }
}

module.exports = new UserProfile();