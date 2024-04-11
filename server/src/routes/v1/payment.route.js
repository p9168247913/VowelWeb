const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const stripePayment = require('../../modules/payment/controller/payment.controller')

const router = express.Router();

router.post('/payment-session', auth(), stripePayment);

module.exports = router;