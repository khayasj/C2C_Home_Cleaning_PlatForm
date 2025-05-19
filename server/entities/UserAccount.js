const db = require('../db');

class UserAccount {
  async verifyUserAccount(username, password) {
    const [rows] = await db.execute('SELECT * FROM useraccount WHERE username = ?', [username]);
    const user = rows[0];
    if (!user || user.password !== password) return false;
    return true;
  }

  async createUserAccount(username, password, profilename, firstname, lastname, email, phone) { 
    //check if a useracct with same username already exists
    const [existing] = await db.execute('SELECT * FROM useraccount WHERE username = ?', [username]);
    if (existing.length > 0) return false;

    //check what it is inserting
    console.log('Inserting user with:', {
      username,
      password,
      profilename,
      firstname,
      lastname,
      email,
      phone
    });
    
    await db.execute('INSERT INTO useraccount (username, password, profilename, firstname, lastname, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      username,
      password,
      profilename,
      firstname,
      lastname,
      email,
      phone
    ]);
    return true;
  }

  async viewUserAccount() {
    const [UserAccount] = await db.execute('SELECT * FROM useraccount');
    return UserAccount;
  }

  async updateUserAccount(username, updatedData) {
    const { password, firstname, lastname, email, phone, profilename } = updatedData;
    const [result] = await db.execute(
      'UPDATE useraccount SET password = ?, firstname = ?, lastname = ?, email = ?, phone = ?, profilename = ? WHERE username = ?',
      [password, firstname, lastname, email, phone, profilename, username]
    );
    return result.affectedRows > 0;
  }
  
  async deleteUserAccount(username) {
    const [result] = await db.execute('DELETE FROM useraccount WHERE username = ?',[username]);
    return result.affectedRows > 0;
  }
  
  async searchUserAccount(firstname) {
    let query = 'SELECT * FROM useraccount';
    let params = [];

    if (firstname) {
      query += ' WHERE firstname LIKE ?';
      params.push(`%${firstname}%`);
    }

    const [UserAccount] = await db.execute(query, params);
    return UserAccount;
  }
}

module.exports = new UserAccount();
