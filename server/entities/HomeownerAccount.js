const db = require('../db');

class HomeownerAccount {
    async viewService(homeownerusername) {
        let query = 'SELECT c.*, FALSE as isShortlisted FROM cleaningservice c';
        let params = [];
        const [services] = await db.execute(query, params);

        // If homeownerusername provided, check which services are in the user's shortlist
        // “Is this particular service one of the services the homeowner has shortlisted?”
        if (homeownerusername) {
            const [shortlisted] = await db.execute(
                'SELECT cleanerusername, cleaningservicename FROM serviceshortlist WHERE homeownerusername = ?',
                [homeownerusername]
            );
            
            // Create a lookup map using composite key
            // each item is a row from the serviceshortlist table
            const shortlistedMap = new Map();
            shortlisted.forEach(item => {
                const key = `${item.cleanerusername}_${item.cleaningservicename}`;
                shortlistedMap.set(key, true);
            });
            
            // Mark services that are in the shortlist
            // full list of all available services, each service is a row from the cleaningservice table
            services.forEach(service => {
                const serviceKey = `${service.cleanerusername}_${service.cleaningservicename}`;
                if (shortlistedMap.has(serviceKey)) {
                    service.isShortlisted = true;
                }
                // No need for else, it's initialized to false
            });
        }
      
        return services;
    } 

    async searchService(cleaningservicename, homeownerusername) {
        let query = 'SELECT *, FALSE as isShortlisted FROM cleaningservice';
        let params = [];
      
        if (cleaningservicename) {
          query += ' WHERE cleaningservicename LIKE ?';
          params.push(`%${cleaningservicename}%`);
        }
      
        const [services] = await db.execute(query, params);

        if (homeownerusername) {
            const [shortlisted] = await db.execute(
                'SELECT cleanerusername, cleaningservicename FROM serviceshortlist WHERE homeownerusername = ?',
                [homeownerusername]
            );
            
            // Create a lookup map using composite key
            const shortlistedMap = new Map();
            shortlisted.forEach(item => {
                const key = `${item.cleanerusername}_${item.cleaningservicename}`;
                shortlistedMap.set(key, true);
            });
            
            // Mark services that are in the shortlist
            services.forEach(service => {
                const serviceKey = `${service.cleanerusername}_${service.cleaningservicename}`;
                if (shortlistedMap.has(serviceKey)) {
                    service.isShortlisted = true;
                }
                // No need for else, it's initialized to false
            });
        }

        return services;
    } 

    async viewShortlist(homeownerusername) {
        // Join serviceshortlist with cleaningservice to get full details and correct counts
        let query = `
            SELECT 
                cs.cleanerusername, 
                cs.cleaningservicename, 
                cs.cleaningdescription, 
                cs.servicecategory, 
                cs.price, 
                cs.numofviews, 
                cs.numofshortlist 
            FROM serviceshortlist ss
            JOIN cleaningservice cs 
              ON ss.cleanerusername = cs.cleanerusername 
             AND ss.cleaningservicename = cs.cleaningservicename
            WHERE ss.homeownerusername = ?
        `;
        let params = [homeownerusername];
      
        const [services] = await db.execute(query, params);
        return services;
    }

    // searchShortlist is essentially the same as viewShortlist with filtering
    async searchShortlist(homeownerusername, cleaningservicename) {
        let query = `
        SELECT 
            cs.cleanerusername, 
            cs.cleaningservicename, 
            cs.cleaningdescription, 
            cs.servicecategory, 
            cs.price, 
            cs.numofviews, 
            cs.numofshortlist 
        FROM serviceshortlist ss
        JOIN cleaningservice cs 
          ON ss.cleanerusername = cs.cleanerusername 
         AND ss.cleaningservicename = cs.cleaningservicename
        WHERE ss.homeownerusername = ?
        `;
        let params = [homeownerusername];
    
        if (cleaningservicename) {
            query += ' AND cs.cleaningservicename LIKE ?';
            params.push(`%${cleaningservicename}%`);
        }
    
        const [services] = await db.execute(query, params);
        return services;
    }

    async viewPastMatches(homeownerusername) {
        const [services] = await db.execute(
            'SELECT * FROM confirmmatches WHERE homeownerusername = ?', [homeownerusername]);
        return services;
    }  

    async searchPastMatches(homeownerusername, cleaningservicename) {
        let query = 'SELECT * FROM confirmmatches WHERE homeownerusername = ?';
        let params = [homeownerusername];
      
        if (cleaningservicename) {
          query += ' AND cleaningservicename LIKE ?';
          params.push(`%${cleaningservicename}%`);
        }
      
        const [services] = await db.execute(query, params);
        return services;
    }    

}

module.exports = new HomeownerAccount ();
