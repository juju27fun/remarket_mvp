const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel.js');
const { generateTokens } = require('../utils.js');
const data = require('./user_set');  // Adjust the path as necessary
const jwt = require('jsonwebtoken');

// KYC Verification
const updateKYCDetails = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.kycDetails.dob = req.body.dob || user.kycDetails.dob;
    user.kycDetails.address = req.body.address || user.kycDetails.address;
    user.kycDetails.city = req.body.city || user.kycDetails.city;
    user.kycDetails.postalCode = req.body.postalCode || user.kycDetails.postalCode;
    user.kycDetails.country = req.body.country || user.kycDetails.country;
    user.kycDetails.documentType = req.body.documentType || user.kycDetails.documentType;
    user.kycDetails.documentNumber = req.body.documentNumber || user.kycDetails.documentNumber;

    const isKYCValid = (
      user.kycDetails.dob && 
      user.kycDetails.address && 
      user.kycDetails.city &&
      user.kycDetails.postalCode &&
      user.kycDetails.country &&
      user.kycDetails.documentType &&
      user.kycDetails.documentNumber.match(/^\d+$/) // Example check: Ensure document number is numeric
    );
    
    if (isKYCValid) {
      user.seller.kycStatus = 'verified'; // Update status after verification
    } else {
      user.seller.kycStatus = 'pending';
    }
    const updatedUser = await user.save();
    res.send({
      message: 'KYC details updated successfully',
      kycStatus: updatedUser.seller.kycStatus,
    });
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});

const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshsecret';


const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

const refreshAccessToken = async (req, res) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const refreshToken = authorization.slice(7, authorization.length); // Bearer XXXXXX
    try {
      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        throw new Error('Invalid refresh token');
      }
      
      // Fetch the user from the database using the _id from the decoded token
      const user = await User.findById(decoded._id);
      if (!user) {
        throw new Error('User not found');
      }

      const { accessToken } = generateTokens(user);
      res.json({ accessToken });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  } else {
    res.status(401).json({ message: 'No refresh token provided' });
  }
};

const getTopSellers = expressAsyncHandler(async (req, res) => {
  const topSellers = await User.find({ isSeller: true })
    .sort({ 'seller.rating': -1 })
    .limit(3);
  res.send(topSellers);
});

const seedUsers = expressAsyncHandler(async (req, res) => {
  // await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdUsers });
});

const signin = expressAsyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const { accessToken, refreshToken } = generateTokens(user);
      
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
        accessToken,
        refreshToken,
      });
      
      return;
    }
  }
  res.status(401).send({ message: 'Invalid email or password' });
});

const register = expressAsyncHandler(async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  const createdUser = await user.save();
  const { accessToken, refreshToken } = generateTokens(createdUser);

  res.send({
    _id: createdUser._id,
    name: createdUser.name,
    email: createdUser.email,
    isAdmin: createdUser.isAdmin,
    isSeller: createdUser.isSeller,
    accessToken,
    refreshToken,
  });
});

const getUserById = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

const updateUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (user.isSeller) {
      user.seller.name = req.body.sellerName || user.seller.name;
      user.seller.logo = req.body.sellerLogo || user.seller.logo;
      user.seller.description = req.body.sellerDescription || user.seller.description;
    }
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 8);
    }
    const updatedUser = await user.save();
    const { accessToken, refreshToken } = generateTokens(updatedUser);

    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isSeller: updatedUser.isSeller,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});

const getUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

const deleteUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.email === 'admin@example.com') {
      res.status(400).send({ message: 'Can Not Delete Admin User' });
      return;
    }
    const deleteUser = await user.remove();
    res.send({ message: 'User Deleted', user: deleteUser });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

const updateUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isSeller = Boolean(req.body.isSeller);
    user.isAdmin = Boolean(req.body.isAdmin);
    const updatedUser = await user.save();
    res.send({ message: 'User Updated', user: updatedUser });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

module.exports = {
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
  updateKYCDetails,
};
