const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Middleware для защиты маршрутов
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Проверяем наличие токена в заголовке Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Получаем токен из заголовка
      token = req.headers.authorization.split(' ')[1];

      // Проверяем токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Получаем данные пользователя, исключая пароль
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Не авторизован, токен не прошел проверку');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Не авторизован, токен отсутствует');
  }
});

// Middleware для проверки прав администратора
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Не авторизован как администратор');
  }
};

module.exports = { protect, admin }; 