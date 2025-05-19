const CleaningService = require('../entities/CleaningService');

class CleanerCreateServiceController {
  async createService(req, res) {
    const { cleanerusername, cleaningservicename, cleaningdescription, servicecategory, price } = req.body;

    try {
      const success = await CleaningService.createService(cleanerusername, cleaningservicename, cleaningdescription, servicecategory, price);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(400).json({ success: false });
      }
    } catch (err) {
      console.error('Error creating service(runtime error):', err);
      res.status(500).json({ success: false });
    }
  }
}

class CleanerViewServiceController {
  async viewService(req, res) {
    const cleanerusername = req.params.cleanerusername;
    try {
      const services = await CleaningService.viewService(cleanerusername);
      return res.json(services);
    } catch (err) {
      console.error('Error fetching services:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

class CleanerUpdateServiceController {
  async updateService(req, res) {
    const cleaningservicename = req.params.cleaningservicename;
    const cleanerusername = req.params.cleanerusername;
    const updatedData = req.body;
    try {
      const success = await CleaningService.updateService(cleaningservicename, cleanerusername, updatedData);
      res.json({ success });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  }
}

class CleanerDeleteServiceController {
  async deleteService(req, res) {
    const cleaningservicename = req.params.cleaningservicename;
    const cleanerusername = req.params.cleanerusername;
    // debugging
    console.log('Deleting service:',cleaningservicename, cleanerusername);
    try {
      const success = await CleaningService.deleteService(cleaningservicename, cleanerusername);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  }
}

class CleanerSearchServiceController {
  async searchService(req, res) {
    const cleanerusername = req.params.cleanerusername;
    const cleaningservicename = req.query.cleaningservicename || '';

    try {
      const services = await CleaningService.searchService(cleanerusername, cleaningservicename);
      return res.json(services);
    } catch (err) {
      console.error('Error fetching services:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

class CleanerViewServiceHistoryController {
  async viewServiceHistory(req, res) {
    const cleanerusername = req.params.cleanerusername;

    try {
      const services = await CleaningService.viewServiceHistory(cleanerusername);
      return res.json(services);
    } catch (err) {
      console.error('Error fetching services:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

class CleanerSearchServiceHistoryController {
  async searchServiceHistory(req, res) {
    const cleanerusername = req.params.cleanerusername;
    const cleaningservicename = req.query.cleaningservicename || '';

    try {
      const services = await CleaningService.searchServiceHistory(cleanerusername, cleaningservicename);
      return res.json(services);
    } catch (err) {
      console.error('Error fetching services:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = {
    CleanerCreateServiceController: new CleanerCreateServiceController(),
    CleanerViewServiceController: new CleanerViewServiceController(),
    CleanerUpdateServiceController: new CleanerUpdateServiceController(),
    CleanerDeleteServiceController: new CleanerDeleteServiceController(),
    CleanerSearchServiceController: new CleanerSearchServiceController(),
    CleanerViewServiceHistoryController: new CleanerViewServiceHistoryController(),
    CleanerSearchServiceHistoryController: new CleanerSearchServiceHistoryController()
};

