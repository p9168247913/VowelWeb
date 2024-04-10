const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const addressController = require('../../modules/address/controller/getAddressById.controller')

const router = express.Router();

router.get('/:id', auth(), addressController);

module.exports = router;