const db = require('../db');

class ServiceCategory {
  async createServiceCategory(servicecategory, servicedescription) { 
    // Check for empty string
    if (!servicecategory || servicecategory.trim() === '') {
      console.log('Invalid servicecategory:', servicecategory);
      return false;
    }
    
    // check for existing service category
    const [existing] = await db.execute('SELECT * FROM servicecategory WHERE servicecategory = ?', [servicecategory]);
    if (existing.length > 0) return false;
    
    await db.execute('INSERT INTO servicecategory (servicecategory, servicedescription) VALUES (?, ?)', [
      servicecategory,
      servicedescription
    ]);
    return true;
  }

  async viewServiceCategory() {
    const [servicecategories] = await db.execute(
      'SELECT * FROM servicecategory');
    return servicecategories;
  }

  async updateServiceCategory(servicecategory, updatedData) {
    const { servicedescription } = updatedData;
    const [result] = await db.execute(
      'UPDATE servicecategory SET servicedescription = ? WHERE servicecategory = ?',
      [servicedescription, servicecategory]
    );
    return result.affectedRows > 0;
  }
  
  async deleteServiceCategory(servicecategory) {
    const [result] = await db.execute('DELETE FROM servicecategory WHERE servicecategory = ?',[servicecategory]);
    return result.affectedRows > 0;
  }

  async searchServiceCategory(servicecategory) {
    const [servicecategories] = await db.execute(
      'SELECT * FROM servicecategory WHERE servicecategory LIKE ?',
      [`%${servicecategory}%`]);
    return servicecategories;
  }

  async generateDailyCategories() {
    const query = `
      SELECT cs.servicecategory, sc.servicedescription, COUNT(*) AS total
      FROM confirmmatches cm
      JOIN cleaningservice cs 
        ON cm.cleaningservicename = cs.cleaningservicename
        AND cm.cleanerusername = cs.cleanerusername
      JOIN servicecategory sc
        ON cs.servicecategory = sc.servicecategory
      WHERE cm.cleaningdate >= CURDATE() - INTERVAL 1 DAY
      GROUP BY cs.servicecategory, sc.servicedescription
      `;
    const [rows] = await db.execute(query);
    return rows;
  }

  async generateWeeklyCategories() {
    const query = `
      SELECT cs.servicecategory, sc.servicedescription, COUNT(*) AS total
      FROM confirmmatches cm
      JOIN cleaningservice cs 
        ON cm.cleaningservicename = cs.cleaningservicename
        AND cm.cleanerusername = cs.cleanerusername
      JOIN servicecategory sc
        ON cs.servicecategory = sc.servicecategory
      WHERE cm.cleaningdate >= CURDATE() - INTERVAL 7 DAY
      GROUP BY cs.servicecategory, sc.servicedescription
      `;
    const [rows] = await db.execute(query);
    return rows;
  }

  async generateMonthlyCategories() {
    const query = `
      SELECT cs.servicecategory, sc.servicedescription, COUNT(*) AS total
      FROM confirmmatches cm
      JOIN cleaningservice cs 
        ON cm.cleaningservicename = cs.cleaningservicename
        AND cm.cleanerusername = cs.cleanerusername
      JOIN servicecategory sc
        ON cs.servicecategory = sc.servicecategory
      WHERE cm.cleaningdate >= CURDATE() - INTERVAL 1 MONTH
      GROUP BY cs.servicecategory, sc.servicedescription
      `;
    const [rows] = await db.execute(query);
    return rows;
  }
}

module.exports = new ServiceCategory();
  