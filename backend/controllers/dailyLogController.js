const DailyLog = require('../models/dailyLog');

const createDailyLog = async (req, res) => {
  try {
    const newLog = await DailyLog.create(req.body);
    res.status(201).json(newLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllDailyLogs = async (req, res) => {
  try {
    const logs = await DailyLog.find().populate('user').populate('extraSnacks');
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDailyLogsByUser = async (req, res) => {
  try {
    const logs = await DailyLog.find({ user: req.params.userId }).populate('extraSnacks');
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDailyLogById = async (req, res) => {
  try {
    const log = await DailyLog.findById(req.params.id).populate('user').populate('extraSnacks');
    if (!log) return res.status(404).json({ error: 'Daily log not found' });
    res.status(200).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateDailyLog = async (req, res) => {
  try {
    const updatedLog = await DailyLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLog) return res.status(404).json({ error: 'Daily log not found' });
    res.status(200).json(updatedLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteDailyLog = async (req, res) => {
  try {
    const deleted = await DailyLog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Daily log not found' });
    res.status(200).json({ message: 'Daily log deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createDailyLog,
  getAllDailyLogs,
  getDailyLogsByUser,
  getDailyLogById,
  updateDailyLog,
  deleteDailyLog
};
