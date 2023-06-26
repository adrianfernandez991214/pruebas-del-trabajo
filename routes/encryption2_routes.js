const { Router } = require('express');
const { encrypt, decrypt } = require('../controllers/encryption2_controller');
const router = Router();

// encrypt
router.get('/', encrypt);

// decrypt
router.post('/', decrypt);

module.exports = router;
