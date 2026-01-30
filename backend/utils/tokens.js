const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const refreshTokenModel = require('../models/refreshTokenModel');
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

async function generateRefreshToken(account) {
  const jti = crypto.randomBytes(16).toString('hex');
  const payload = { account_id: account.account_id, account_email: account.account_email, jti: jti };
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  const refreshTokenHash = await bcrypt.hashItem(refreshToken, 10);
  const tokenData = {
    account_id: account.account_id,
    token_hash: refreshTokenHash,
    jti: jti,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }

  console.log('tokenhash: ', tokenData.token_hash);
  try {
    refreshTokenModel.createRefreshTokenModel(tokenData);
  } catch (error) {
    console.error('Error storing refresh token:', error);
    throw new Error('Could not store refresh token');
  }

  return { refreshToken, jti };
}

module.exports = {
  setRefreshCookie,
  generateRefreshToken
};