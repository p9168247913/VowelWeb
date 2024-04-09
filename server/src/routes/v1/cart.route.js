const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const cartValidation = require('../../modules/cart/cart.validation')
const cartController = require('../../modules/cart/controller')

const router = express.Router();

router.post('/add',  validate(cartValidation), auth(), cartController.addCart);

router.get('/:id', auth(), cartController.getCartById);

// router.put('/update/:id',  upload.single('productImage'), validate(cartValidation), auth("adminAccess"), cartController.updateProduct);

router.delete('/delete/:id', auth(), cartController.deleteCart);

module.exports = router;