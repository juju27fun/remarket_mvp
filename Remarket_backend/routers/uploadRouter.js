const express = require('express');
const { isAuth } = require('../utils.js');
const { uploadImage, getImage, deleteImage, getImageById } = require('../controlers/uploadControler');

const router = express.Router();

router.post('/', isAuth, uploadImage);
router.get('/:filename', getImage);
router.delete('/:filename', isAuth, deleteImage);
router.get('/id/:id', getImageById);
module.exports = router;