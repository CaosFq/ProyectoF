const { Router } = require("express");
const { check } = require("express-validator");
const {
    updatePassword,
    getOrdersUser,
    getOrderUserById,
    updateUserById,
    deleteUserById
} = require("../controllers/user.controller");

const { protectAccountOwner, protect } = require("../middlewares/auth/auth.middleware");
const { validUserById } = require("../middlewares/user.middleware");
const { validateFields } = require("../middlewares/validateField.middleware");

const router = Router()

router.use(protect)

router.get('/orders', getOrdersUser)

router.get('/orders/:id', getOrderUserById)

router.patch('/:id', [
    check('name', 'the name is mandatory').not().isEmpty(),
    check('email', 'the email is mandatory').not().isEmpty(),
    validateFields,
    validUserById,
    protectAccountOwner
], updateUserById)

router.patch('/password/:id', [
    check('currentPassword', 'The current password must be mandatory').not().isEmpty(),
    check('newPassword', 'The new password must be mandatory').not().isEmpty(),
    validateFields,
    validUserById,
    protectAccountOwner
], updatePassword)

router.delete('/:id', validUserById, protectAccountOwner, deleteUserById)

module.exports = {
    userRouter: router
}