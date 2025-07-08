const DailyLog = require('../models/dailyLog');
const { checkMissingFields } = require('../utils/validation');

const createDailyLog = async (req, res) => {
  try {
    req.body.date = new Date(req.body.date);
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

const getDailyLogs = async (req, res) => {
  try {
    const logs = await DailyLog.find({ user: req.user._id }).populate('extraSnacks');
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

const mongoose = require('mongoose');

const getDailyLogByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const userId = req.user._id;

    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required (e.g. 2025-06-26)' });
    }

    const startOfDay = new Date(date + 'T00:00:00.000Z');
    const endOfDay = new Date(date + 'T23:59:59.999Z');

    const log = await DailyLog.findOne({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).populate('extraSnacks');

    if (!log) {
      return res.status(404).json({ error: 'No daily log found for that date' });
    }

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
  getDailyLogs,
  getDailyLogById,
  getDailyLogByDate,
  updateDailyLog,
  deleteDailyLog
};
