const express = require('express');
const { searchAlumni, getAlumniProfile, sendConnectionRequest, getConnections, respondToConnection } = require('../controllers/alumniController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', searchAlumni);
router.get('/connections', getConnections); // /api/alumni/connections
router.get('/:id', getAlumniProfile);

// Connections
router.post('/:id/connect', sendConnectionRequest);
router.put('/connections/:id', respondToConnection);

module.exports = router;
