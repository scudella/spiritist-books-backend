const User = require('../models/User');
const Token = require('../models/Token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
  sendVerificationEmail,
} = require('../utils');
const books = require('spiritist-books');
const cloudinary = require('cloudinary').v2;
const { unlink } = require('node:fs/promises');
const crypto = require('crypto');

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select('-password');

  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const newUser = { ...req.body };
  const { userId, email: currentEmail } = req.user;
  const { name, email, lastName } = req.body;
  if (!name || !email || !lastName) {
    throw new CustomError.BadRequestError('Please, provide all values');
  }

  // Check whether the user is trying to update to an email
  // that already is taken by someone else
  const userEmailOwner = await User.findOne({ email });
  if (userEmailOwner && userEmailOwner._id.toString() !== req.user.userId) {
    throw new CustomError.BadRequestError('email already exists');
  } else if (currentEmail !== email) {
    newUser.verificationToken = crypto.randomBytes(40).toString('hex');
    newUser.isVerified = false;
  } else {
    newUser.isVerified = true;
  }

  if (req.file) {
    try {
      const response = await cloudinary.uploader.upload(req.file.path, {
        folder: process.env.CLOUDINARY_FOLDER,
      });
      await unlink(req.file.path);
      newUser.picture = response.secure_url;
      newUser.picturePublicId = response.public_id;
    } catch (error) {
      console.log(error);
    }
  }

  // update and get the previous user config
  const oldUser = await User.findOneAndUpdate({ _id: userId }, newUser, {
    runValidators: true,
  });
  if (req.file && oldUser.picturePublicId) {
    await cloudinary.uploader.destroy(oldUser.picturePublicId);
  }

  // get the user new config
  const user = await User.findOne({ _id: userId }).select('-password');

  if (!newUser.isVerified) {
    // email changed! verify email again
    const origin = process.env.CLIENT_ORIGIN;

    await sendVerificationEmail({
      name: `${user.name} ${user.lastName}`,
      email: user.email,
      verificationToken: user.verificationToken,
      origin,
    });

    res.cookie('accessToken', 'random string', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.cookie('refreshToken', 'random string', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.status(StatusCodes.OK).json({
      msg: 'Success! Please check your email to verify account',
    });
    return;
  }

  // Update token with new values
  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { userId } = req.user;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('Please provide both values');
  }

  const user = await User.findById(userId);
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid credentials');
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Success! Password updated' });
};

const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const bookCount = books.all.length;
  res.status(StatusCodes.OK).json({ users, bookCount });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  getApplicationStats,
};
