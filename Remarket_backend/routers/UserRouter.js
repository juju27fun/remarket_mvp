const express = require('express');
const {
  getTopSellers,
  seedUsers,
  signin,
  register,
  getUserById,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUser,
  refreshAccessToken,
} = require('../controlers/UserControlers.js');
const expressAsyncHandler = require('express-async-handler');
const { isAdmin, isAuth} = require('../utils.js');

const userRouter = express.Router();

userRouter.get('/top-sellers', expressAsyncHandler(getTopSellers));
userRouter.get('/seed', expressAsyncHandler(seedUsers));
userRouter.post('/signin', expressAsyncHandler(signin));
userRouter.post('/register', expressAsyncHandler(register));
userRouter.post('/refresh', expressAsyncHandler(refreshAccessToken));
userRouter.get('/:id', expressAsyncHandler(getUserById));
userRouter.put('/profile', isAuth, expressAsyncHandler(updateUserProfile));
userRouter.get('/', isAuth, isAdmin, expressAsyncHandler(getUsers));
userRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(deleteUser));
userRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(updateUser));

module.exports = userRouter;