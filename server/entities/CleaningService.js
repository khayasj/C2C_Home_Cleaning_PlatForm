const db = require('../db');

class CleaningService {
  async createService(cleanerusername, cleaningservicename, cleaningdescription, servicecategory, price) { 
    // Check if price is a positive number
    if (price <= 0.00) {
      console.log('Invalid price:', price);
      return false;
    }

    //check if a service with same username and service name already exists
    const [existing] = await db.execute('SELECT * FROM cleaningservice WHERE cleanerusername = ? && cleaningservicename = ?', [cleanerusername, cleaningservicename]);
    if (existing.length > 0) return false;

    //check what it is inserting
    console.log('Inserting service with:', {
        cleanerusername,
        cleaningservicename,
        cleaningdescription,
        servicecategory,
        price
    });
    
    await db.execute('INSERT INTO cleaningservice (cleanerusername, cleaningservicename, cleaningdescription, servicecategory, price) VALUES (?, ?, ?, ?, ?)', [
        cleanerusername,
        cleaningservicename,
        cleaningdescription,
        servicecategory,
        price
    ]);
    return true;
  }

  async viewService(cleanerusername) {
    const [services] = await db.execute(
      'SELECT * FROM cleaningservice WHERE cleanerusername LIKE ?', [cleanerusername]);
    return services;
  }

  async updateService(cleaningservicename, cleanerusername, updatedData) {
    const { cleaningdescription, servicecategory, price } = updatedData;
    // Check if price is a positive number
    if (price <= 0.00) {
      console.log('Invalid price:', price);
      return false;
    }
    
    const [result] = await db.execute(
      'UPDATE cleaningservice SET cleaningdescription = ?, servicecategory = ?, price = ? WHERE cleaningservicename = ? && cleanerusername = ?',
      [ cleaningdescription, servicecategory, price, cleaningservicename, cleanerusername ]
    );
    return result.affectedRows > 0;
  }
  
  async deleteService(cleaningservicename, cleanerusername) {
    const [result] = await db.execute('DELETE FROM cleaningservice WHERE cleanerusername = ? && cleaningservicename =?',[cleanerusername, cleaningservicename]);
    return result.affectedRows > 0;
  }
  
  async searchService(cleanerusername, cleaningservicename) {
    let query = 'SELECT * FROM cleaningservice WHERE cleanerusername = ?';
    let params = [cleanerusername];
  
    if (cleaningservicename) {
      query += ' AND cleaningservicename LIKE ?';
      params.push(`%${cleaningservicename}%`);
    }
  
    const [services] = await db.execute(query, params);
    return services;
  }  

  async viewServiceHistory(cleanerusername) {
    const [services] = await db.execute('SELECT * FROM confirmmatches WHERE cleanerusername = ?', [cleanerusername]);
    return services;
  }  

  async searchServiceHistory(cleanerusername, cleaningservicename) {
    let query = 'SELECT * FROM confirmmatches WHERE cleanerusername = ?';
    let params = [cleanerusername];
  
    if (cleaningservicename) {
      query += ' AND cleaningservicename LIKE ?';
      params.push(`%${cleaningservicename}%`);
    }
  
    const [services] = await db.execute(query, params);
    return services;
  }  
}

module.exports = new CleaningService();
