const express = require('express');
const router = express.Router();
const {
  getAllRates,
  addTdRates,
  updateTdRate,
  deleteTdRates
} = require('../controllers/tdRatesController');
const { protect } = require('../middleware/auth');

router.get('/', getAllRates);
router.post('/', protect, addTdRates);
router.put('/:tdRateId', protect, updateTdRate);
router.delete('/:tdRateId', protect, deleteTdRates);

module.exports = router;
