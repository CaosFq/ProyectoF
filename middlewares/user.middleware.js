const User = require("../models/users.model");
const AppError = require("../utils/appError");

exports.validUserById = async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findOne({
        where: {
            id,
            status: true
        }
    })

    if (!user) {
        return next(new AppError('User not found', 400))

    }
    req.user = user
    next()
}

exports.validIfExistUserEmail = async (req, res, next) => {
    const { email } = req.body

    const user = await User.findOne({
        where: {
            email: email.toLowerCase()
        }
    })

    if (user && !user.status) {
        return next(new AppError('The user has an account, but it is deactivated, please talk to the administrator to activate it.', 400))

    }

    if (user) {
        return next(new AppError('the email user already exists', 400))
    }

    next()
}
// ? next =  sirve para decirle que siga ah la siguiente funcion.