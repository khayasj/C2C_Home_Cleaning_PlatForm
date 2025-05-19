const HomeownerAccount = require('../entities/HomeownerAccount');
const Shortlist = require('../entities/Shortlist');
const db = require('../db');

class HomeownerViewServiceController {
  async viewService(req, res) {
    const homeownerusername = req.query.homeownerusername || '';

    try {
      const services = await HomeownerAccount.viewService(homeownerusername);
      return res.json(services);
    } catch (err) {
      console.error('Error fetching services:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

class HomeownerSearchServiceController {
  async searchService(req, res) {
    const cleaningservicename = req.query.cleaningservicename || '';
    const homeownerusername = req.query.homeownerusername || '';

    try {
      const services = await HomeownerAccount.searchService(cleaningservicename, homeownerusername);       
      return res.json(services);

    } catch (err) {
      console.error('Error fetching services:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

class HomeownerViewShortlistController {
    async viewShortlist(req, res) {
      // Requires homeowner username to know whose shortlist to view
      const homeownerusername = req.query.homeownerusername; // Assuming homeownerusername is passed as query param
  
      try {
        // Pass homeownerusername to the entity method
        const services = await HomeownerAccount.viewShortlist(homeownerusername);
        return res.json(services);
      } catch (err) {
        console.error('Error fetching shortlist:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
}

class HomeownerSearchShortlistController {
  async searchShortlist(req, res) {
    // Requires homeowner homeownerusername
    const homeownerusername = req.query.homeownerusername; // Assuming homeownerusername is passed as query param
    const cleaningservicename = req.query.cleaningservicename || '';

    try {
      // Pass homeownerusername to the entity method
      const services = await HomeownerAccount.searchShortlist(homeownerusername, cleaningservicename);
      return res.json(services);
    } catch (err) {
      console.error('Error searching shortlist:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

class HomeownerViewHistoryController {
  async viewServiceHistory(req, res) {
    const homeownerusername = req.params.homeownerusername;

    try {
      const services = await HomeownerAccount.viewPastMatches(homeownerusername);
      return res.json(services);
    } catch (err) {
      console.error('Error fetching services:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

class HomeownerSearchHistoryController {
  async searchServiceHistory(req, res) {
    const homeownerusername = req.params.homeownerusername;
    const cleaningservicename = req.query.cleaningservicename || '';

    try {
      const services = await HomeownerAccount.searchPastMatches(homeownerusername, cleaningservicename);
      return res.json(services);
    } catch (err) {
      console.error('Error fetching services:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

class HomeownerAddShortlistController {
  async addToShortlist(req, res) {
    const { homeownerusername, cleanerusername, cleaningservicename } = req.body;
    if (!homeownerusername || !cleanerusername || !cleaningservicename) {
      return res.status(400).json({ success: false });
    }
    try {
      const result = await Shortlist.addToShortlist(homeownerusername, cleanerusername, cleaningservicename);
      if (result.success) {
        res.json(result); // Send back success and new count
      } else {
        res.status(400).json(result); // Send back failure reason
      }
    } catch (err) {
      console.error('Error in addToShortlist controller:', err);
      res.status(500).json({ success: false });
    }
  }
}

class HomeownerRemoveShortlistController{
  async removeFromShortlist(req, res) {
    const { homeownerusername, cleanerusername, cleaningservicename } = req.body;
      if (!homeownerusername || !cleanerusername || !cleaningservicename) {
        return res.status(400).json({ success: false });
    }
    try {
      const result = await Shortlist.removeFromShortlist(homeownerusername, cleanerusername, cleaningservicename);
        if (result.success) {
          res.json(result); // Send back success and new count
      } else {
          res.status(400).json(result); // Send back failure reason
      }
    } catch (err) {
      console.error('Error in removeFromShortlist controller:', err);
      res.status(500).json({ success: false });
    }
  }
}


module.exports = {
    HomeownerViewServiceController: new HomeownerViewServiceController(),
    HomeownerSearchServiceController: new HomeownerSearchServiceController(),
    HomeownerViewShortlistController: new HomeownerViewShortlistController(),
    HomeownerSearchShortlistController: new HomeownerSearchShortlistController(),
    HomeownerViewHistoryController: new HomeownerViewHistoryController(),
    HomeownerSearchHistoryController: new HomeownerSearchHistoryController(),
    HomeownerAddShortlistController: new HomeownerAddShortlistController(),
    HomeownerRemoveShortlistController: new HomeownerRemoveShortlistController()
};
