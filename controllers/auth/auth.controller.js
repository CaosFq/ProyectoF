const { ref, uploadBytes } = require('firebase/storage')

const catchAsync = require("../../utils/catchAsync");
const bcrypt = require("bcryptjs");
const generateJWT = require("../../utils/jwt");
const AppError = require("../../utils/appError");
const { storage } = require('../../utils/firebase');
const User = require('../../models/users.model');

exports.createUser = catchAsync(async (req, res, next) => {

    const { name, email, password, role } = req.body

    /* const imgRef = ref(storage, `users/${Date.now()}-${req.file.originalname}`)
    const imgUpload = await uploadBytes(imgRef, req.file.buffer) */

    const user = new User({
        name,
        email,
        password,
        role,
        /* profileImageUrl: imgUpload.metadata.fullPath */
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = await generateJWT(user.id)

    res.status(201).json({
        status: 'success',
        message: 'The user was created successfully',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            /* profileImageUrl: user.profileImageUrl */
        }
    });
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    //? 1. Verificar si existe el usuario y la contraseña son correctas
    const user = await User.findOne({
        where: {
            email: email.toLowerCase(),
            status: true
        }
    })

    if (!user) {
        return next(new AppError('The user could not be found', 404))
    }

    const verifPassword = await bcrypt.compare(password, user.password)

    if (!verifPassword) {
        return next(new AppError('Incorrect email or password', 401))
    }

    // ? 2. si todo esta bien, enviar token al cliente
    const token = await generateJWT(user.id)

    res.status(200).json({
        status: 'sucsess',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })
})

exports.renewToken = catchAsync(async (req, res, next) => {
    const { id } = req.sessionUser

    const token = await generateJWT(id)

    const user = await User.findOne({
        attributes: ['id', 'username', 'email', 'role'],
        where: {
            status: true,
            id
        }
    })

    return res.status(200).json({
        status: 'sucsess',
        token,
        user
    })
})

// ! Casi siempre sera de este modo la creacion de usuario

// ! Cardinalidad en base de datos.??

// ! cardinalidad 1:1..?? tiene relacion uno a uno

// ! cardinalidad 1:N ...?? tiene muchas realciones

// ! cardinalidad N:N ...?? muchas relaciones entre ambos