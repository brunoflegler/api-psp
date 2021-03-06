const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')
const { promisify } = require('util')

const { User } = require('../models')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Token not provided' })
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)

    const user = await User.findByPk(decoded.id)

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    req.user = { id: user.id }

    next()
  } catch (err) {
    /* istanbul ignore if */
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }

    return res.status(401).json({ message: 'Token others error' })
  }
}
