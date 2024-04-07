const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const productValidation = require('../../modules/product/product.validation')
const productController = require('../../modules/product/controller')
const path = require("path")
const multer = require('multer')

const router = express.Router();


const storage = multer.diskStorage({
  destination: './uploads/Products',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|PNG)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

router.post('/add', upload.single('productImage'), validate(productValidation), auth("adminAccess"), productController.addProduct);

router.get('/', auth(), productController.getProducts);

router.put('/update/:id',  upload.single('productImage'), validate(productValidation), auth(), productController.updateProduct);

router.put('/delete/:id', auth("adminAccess"), productController.deleteProduct);

module.exports = router;