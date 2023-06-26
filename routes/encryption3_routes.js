const { Router } = require('express');
const { encrypt, decrypt } = require('../controllers/encryption3_controller');
const router = Router();

// encrypt
router.get('/', encrypt);

// decrypt
router.post('/', decrypt);

module.exports = router;
