const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/auth')
const {
    calculateAllowance,
    getAllowanceHistory,
    getAllowanceCalculationById
} =require('../controllers/allowanceController');
const { route } = require('./authRoutes');

router.post('/calculate',protect,calculateAllowance);
router.get('/history',protect,getAllowanceHistory);
router.get('/calculations/:calculationId',protect,getAllowanceCalculationById);
module.exports = router;