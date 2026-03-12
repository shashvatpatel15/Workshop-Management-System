const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const workshopController = require('../controllers/workshopController');

// Public routes
router.get('/', workshopController.getAllWorkshops);
router.get('/stats', workshopController.getStats);
router.get('/:id', workshopController.getWorkshopById);

// Protected routes
router.post('/', auth, workshopController.createWorkshop);
router.put('/:id', auth, workshopController.updateWorkshop);
router.delete('/:id', auth, workshopController.deleteWorkshop);
router.get('/:id/registrants', auth, workshopController.getWorkshopRegistrants);

module.exports = router;
