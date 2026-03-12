const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const registrationController = require('../controllers/registrationController');

// All registration routes must be protected for authenticated colleagues
router.use(auth);

router.post('/', registrationController.registerForWorkshop);
router.get('/me', registrationController.getMyRegistrations);
router.delete('/:workshopId', registrationController.deregisterFromWorkshop);

module.exports = router;
