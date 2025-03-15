const path = require('path');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Загрузка изображения
// @route   POST /api/upload
// @access  Private
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Пожалуйста, загрузите изображение');
  }

  res.json(`/${req.file.path.replace(/\\/g, '/')}`);
});

module.exports = { uploadImage }; 