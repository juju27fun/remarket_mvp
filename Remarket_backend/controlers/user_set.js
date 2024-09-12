const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('adminpassword', 8),
    isAdmin: true,
    isSeller: false,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 8),
    isAdmin: false,
    isSeller: true,
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 8),
    isAdmin: false,
    isSeller: false,
  },
];

module.exports = {
  users,
};