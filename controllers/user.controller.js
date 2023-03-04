const catchAsync = require("../utils/catchAsync")

exports.getOrdersUser = catchAsync(async (req, res, next) => {

})

exports.getOrderUserById = catchAsync(async (req, res, next) => {

})

exports.updateUserById = catchAsync(async (req, res, next) => {
    const { user } = req

    const { name, email } = req.body

    const updateInfoUser = user.update({
        name,
        email
    })

    res.status(200).json({
        status: 'sucsses',
        message: 'User information updated successfully',
        updateInfoUser
    })
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    const { user } = req
    const { currentPassword, newPassword } = req.body

    const verifPassword = await bcrypt.compare(currentPassword, user.password)

    if (!verifPassword) {
        return next(new AppError('Incorrect password', 401))
    }

    const salt = await bcrypt.genSalt(10);
    const encriptedPassword = await bcrypt.hash(newPassword, salt);

    await user.update({
        password: encriptedPassword,
        passwordChangeAt: new Date()
    })

    res.status(200).json({
        status: 'sucsess',
        message: 'The user password wa updated successfully'
    })

})

exports.deleteUserById = catchAsync(async (req, res, next) => {
    const { user } = req

    await user.update({
        status: false
    })

    res.status(200).json({
        status: 'sucsses',
        message: 'User deleted successfully'
    })
})