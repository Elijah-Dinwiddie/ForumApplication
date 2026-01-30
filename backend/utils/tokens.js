const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const refreshToken = require('../models/refreshTokenModel');
const bcrypt = require('./bcrypt');

function setRefreshCookie(res, refreshToken) {
  const isProd = process.env.isProd
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/api/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

module.exports = {
  setRefreshCookie
};