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
  updateKYCDetails,
  getProfile,
} = require('../controlers/UserControlers.js');
const expressAsyncHandler = require('express-async-handler');
const { isAdmin, isAuth, refreshAccessToken } = require('../utils.js');

const userRouter = express.Router();

userRouter.get('/top-sellers', expressAsyncHandler(getTopSellers));
userRouter.get('/seed', expressAsyncHandler(seedUsers));
userRouter.post('/signin', expressAsyncHandler(signin));
userRouter.post('/register', expressAsyncHandler(register));
userRouter.post('/refresh', expressAsyncHandler(refreshAccessToken));
userRouter.put('/profile', isAuth, expressAsyncHandler(updateUserProfile));
userRouter.get('/profile', isAuth, expressAsyncHandler(getProfile));
userRouter.get('/', isAuth, isAdmin, expressAsyncHandler(getUsers));
userRouter.get('/:id', expressAsyncHandler(getUserById));
userRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(deleteUser));
userRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(updateUser));
userRouter.put('/kyc', isAuth, expressAsyncHandler(updateKYCDetails));


module.exports = userRouter;
