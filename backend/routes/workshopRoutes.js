const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const workshopController = require('../controllers/workshopController');

// Public route to get all open workshops for colleagues
router.get('/', workshopController.getAllWorkshops);

// Protected routes
router.post('/', auth, workshopController.createWorkshop);

module.exports = router;
