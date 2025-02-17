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
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        generateTokens(user, res); 

        return res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
        });
      }
    }
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


const register = expressAsyncHandler(async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  const createdUser = await user.save();
  generateTokens(createdUser, res);

  res.send({
    _id: createdUser._id,
    name: createdUser.name,
    email: createdUser.email,
    isAdmin: createdUser.isAdmin,
    isSeller: createdUser.isSeller,
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
    generateTokens(updatedUser, res);

    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isSeller: updatedUser.isSeller,
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

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
        seller: user.isSeller ? user.seller : null,
      });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error in fetching user profile' });
  }
};

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
  updateKYCDetails,
  getProfile, 
};