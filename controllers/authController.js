require('dotenv').config();
const User = require('../models/User');
const Token = require('../models/Token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
  verifyGoogleJWT,
  defaultPasswordConfig,
} = require('../utils');
const crypto = require('crypto');
const strongPasswordGenerator = require('strong-password-generator');
const { avatar } = require('../utils/avatar');

const register = async (req, res) => {
  const { name, email, password, lastname } = req.body;
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const verificationToken = crypto.randomBytes(40).toString('hex');

  // Select a random avatar;
  picture = avatar[Math.floor(Math.random() * avatar.length)];

  const user = await User.create({
    name,
    email,
    password,
    lastname,
    role,
    verificationToken,
    picture,
  });

  const origin = process.env.CLIENT_ORIGIN;

  await sendVerificationEmail({
    name: `${user.name} ${user.lastname}`,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  res.status(StatusCodes.CREATED).json({
    msg: 'Success! Please check your email to verify account',
  });
};

const login = async (req, res) => {
  const { email, password, credential, checkbox } = req.body;
  let user;

  if (!credential && (!email || !password)) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }

  // credential from google login
  if (credential) {
    try {
      const { sub, email, email_verified, name, picture } =
        await verifyGoogleJWT(credential);
      user = await User.findOne({ email });
      if (!user) {
        // user does not exist. register required and done here.
        // if exists nothing else required
        if (!email_verified) {
          throw new CustomError.BadRequestError(
            'Please provide valid gmail credentials'
          );
        }
        const password = strongPasswordGenerator.generatePassword();
        user = await User.create({
          name,
          email,
          password,
          role: 'user',
          verificationToken: '',
          isVerified: true,
          verified: Date.now(),
          picture,
          sub,
        });
      } else {
        if (checkbox) {
          await User.findOneAndUpdate({ email }, { picture });
          user.picture = picture;
        }
      }
    } catch (error) {
      throw new CustomError.BadRequestError(
        'Please provide valid gmail credentials'
      );
    }
    // email and password for regular login
  } else {
    user = await User.findOne({ email });
    if (!user) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }

    if (!user.isVerified) {
      throw new CustomError.UnauthenticatedError('Please, verify your email');
    }
  }

  // same path for regular login or google login
  const tokenUser = createTokenUser(user);

  // create refresh token
  let refreshToken = '';

  // check for existing token
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    // the isValid should be always true. If a user is giving a hard time
    // it can be - at this point - manually disabled at the database
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError('Invalid credentials');
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });
  res.cookie('accessToken', 'random string', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie('refreshToken', 'random string', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Verification failed');
  }

  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError('Verification failed');
  }

  await User.findOneAndUpdate(
    { email },
    { isVerified: true, verified: Date.now(), verificationToken: '' },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ msg: 'Email verified' });
};

// It is possible to someone reset the password without verifying the account first
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError('Please provide valid email');
  }

  const user = await User.findOne({ email });
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString('hex');
    // send email
    const origin = process.env.CLIENT_ORIGIN;
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    const passwordTokenHashed = createHash(passwordToken);

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
    await User.findOneAndUpdate(
      { email },
      { passwordToken: passwordTokenHashed, passwordTokenExpirationDate },
      { new: true, runValidators: true }
    );
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Please check your email for reset password link' });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    throw new CustomError.BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date();
    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }
  res.send('reset password');
};

const showWebId = (req, res) => {
  const clientId = process.env.GOOGLE_WEB_CLIENT_ID;
  res.status(StatusCodes.OK).json({ clientId });
};

const showAndroidId = (req, res) => {
  const clientId = process.env.GOOGLE_ANDROID_CLIENT_ID;
  res.status(StatusCodes.OK).json({ clientId });
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  showWebId,
  showAndroidId,
};
