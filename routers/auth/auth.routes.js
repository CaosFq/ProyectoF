const { Router } = require("express");
const { check } = require("express-validator");
const { createUser, login, renewToken } = require("../../controllers/auth/auth.controller");
const { protect } = require("../../middlewares/auth/auth.middleware");
const { validIfExistUserEmail } = require("../../middlewares/user.middleware");
const { validateFields } = require("../../middlewares/validateField.middleware");

const router = Router()

router.post('/signup', [
    check('name', 'The name require').not().isEmpty(),
    check('email', 'The email require').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The pasword must be mandatory').not().isEmpty(),
    validateFields,
    validIfExistUserEmail
], createUser);

router.post('/login', [
    check('email', 'The email require').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The pasword must be mandatory').not().isEmpty(),
    validateFields
], login)

router.use(protect)

router.get('/renew', renewToken)

module.exports = {
    authRouter: router
}