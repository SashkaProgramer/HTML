const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Администратор',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
  {
    name: 'Анна Петрова',
    email: 'anna@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
];

module.exports = users; 