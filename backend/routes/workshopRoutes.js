const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const workshopController = require('../controllers/workshopController');

// Public route to get all open workshops for colleagues
router.get('/', workshopController.getAllWorkshops);

// Protected routes
router.post('/', auth, workshopController.createWorkshop);
router.put('/:id', auth, workshopController.updateWorkshop);
router.delete('/:id', auth, workshopController.deleteWorkshop);
router.get('/:id/registrants', auth, workshopController.getWorkshopRegistrants);

module.exports = router;
