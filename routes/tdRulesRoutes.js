const express = require('express');
const router = express.Router();
const {
  getAllRules,
  getRuleById,
  addTdRule,
  updateRule,
  deleteRule
} = require('../controllers/tdRulesController');
const { protect } = require('../middleware/auth');

router.get('/', getAllRules);
router.get('/:ruleNumber', getRuleById);
router.post('/', protect, addTdRule);
router.put('/:tdRulesId', protect, updateRule);
router.delete('/:tdRulesId', protect, deleteRule);

module.exports = router;
