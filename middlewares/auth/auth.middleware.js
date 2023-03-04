const { promisify } = require("util")
const jwt = require("jsonwebtoken");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const User = require("../../models/users.model");

// ? 1. Proteccion de rutas.
exports.protect = catchAsync(async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return next(new AppError('You are not logged in! Pleace log in to get access', 401))
    }

    const decoded = await promisify(jwt.verify)(token, process.env.SECRETE_JWT_SEED)

    const user = await User.findOne({
        where: {
            id: decoded.id,
            status: true
        }
    })

    if (!user) {
        return next(new AppError('The owner of this token it not loger avaliable', 401))
    }

    if (user.passwordChangeAt) {
        const changedTimeStamp = parseInt(
            user.passwordChangeAt.getTime() / 1000,
            10
        );

        if (decoded.iat < changedTimeStamp) {
            return next(new AppError('User rently change password!, plece login again.', 401))
        }
    }



    req.sessionUser = user

    next()
})

// ? 2. Proteccion de la cuenta.
exports.protectAccountOwner = catchAsync(async (req, res, next) => {
    const { user, sessionUser } = req

    if (user.id !== sessionUser.id) {
        return next(new AppError('You do not own this account', 401))
    }

    next()
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.sessionUser.role)) {
            return next(new AppError('You do not have permission to perfom this action', 403))
        }

        next()
    }
}

// ! PROTECCION DE RUTAS