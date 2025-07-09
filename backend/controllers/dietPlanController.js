const DietPlan = require('../models/dietPlan');

const getDietPlans = async (req, res) => {
  try {
    const plans = await DietPlan.find().populate('schedule.meal');
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDietPlanById = async (req, res) => {
  try {
    const plan = await DietPlan.findById(req.params.id).populate('schedule.meal');
    if (!plan) return res.status(404).json({ error: 'Diet Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDietPlans, getDietPlanById };
