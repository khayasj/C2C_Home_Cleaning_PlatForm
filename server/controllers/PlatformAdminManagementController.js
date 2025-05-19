// PlatformAdminManagementController.js
const ServiceCategory = require('../entities/ServiceCategory');

class PACreateCategoryController {
  async createServiceCategory(req, res) {
    const {servicecategory, servicedescription } = req.body;
    try {
      const success = await ServiceCategory.createServiceCategory(servicecategory, servicedescription);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(400).json({ success: false });
      }
    } catch (err) {
      console.error('Error creating service category:', err);
      res.status(500).json({ success: false });
    }
  }
}


class PAViewCategoryController {
  async viewServiceCategory(req, res) {
    try {
      const categories = await ServiceCategory.viewServiceCategory();
      res.json(categories);
    } catch (err) {
      console.error('Error fetching service categories:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

class PAUpdateCategoryController {
  async updateServiceCategory(req, res) {
    const servicecategory = req.params.servicecategory;
    const updatedData = req.body;
    try {
      const success = await ServiceCategory.updateServiceCategory(servicecategory, updatedData);
      res.json({ success });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  }
}

class PADeleteCategoryController {
  async deleteServiceCategory(req, res) {
    const servicecategory = req.params.servicecategory;
    // debugging
    console.log('Deleting service category:', servicecategory);
    try {
      const success = await ServiceCategory.deleteServiceCategory(servicecategory);
      res.json({ success });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  }
}


class PASearchCategoryController {
  async searchServiceCategory(req, res) {
    const servicecategory = req.query.servicecategory || '';
    try {
      const categories = await ServiceCategory.searchServiceCategory(servicecategory);
      res.json(categories);
    } catch (err) {
      console.error('Error fetching service categories:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}


class PAGenerateDailyCategoryController {
  async generateDailyCategories(req, res) {
    try {
      const categories = await ServiceCategory.generateDailyCategories();
      res.json(categories);
    } catch (err) {
      console.error('Error generating daily categories:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

class PAGenerateWeeklyCategoryController {
  async generateWeeklyCategories(req, res) {
    try {
      const categories = await ServiceCategory.generateWeeklyCategories();
      res.json(categories);
    } catch (err) {
      console.error('Error generating weekly categories:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

class PAGenerateMonthlyCategoryController {
  async generateMonthlyCategories(req, res) {
    try {
      const categories = await ServiceCategory.generateMonthlyCategories();
      res.json(categories);
    } catch (err) {
      console.error('Error generating monthly categories:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 

module.exports = {
PACreateCategoryController : new PACreateCategoryController (),
PAViewCategoryController: new PAViewCategoryController(),
PAUpdateCategoryController : new PAUpdateCategoryController (),
PADeleteCategoryController : new PADeleteCategoryController (),
PASearchCategoryController : new PASearchCategoryController (),
PAGenerateDailyCategoryController : new PAGenerateDailyCategoryController (),
PAGenerateWeeklyCategoryController : new PAGenerateWeeklyCategoryController (), 
PAGenerateMonthlyCategoryController : new PAGenerateMonthlyCategoryController ()
}
