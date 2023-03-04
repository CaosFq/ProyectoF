const Meal = require("../models/meals.model");
const Restaurant = require("../models/restaurants.model");
const catchAsync = require("../utils/catchAsync");

exports.getAllMeals = catchAsync(async (req, res, next) => {
    const meals = await Meal.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: {
            status: 'active'
        },
        include: [
            {
                model: Restaurant,
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            }
        ]
    })

    res.status(200).json({
        status: 'sucsses',
        message: 'Meals obtained succsessfuly',
        meals
    })
})

exports.getMealById = catchAsync(async (req, res, next) => {
    const { meal } = req

    res.status(200).json({
        status: 'sucsses',
        message: 'The meal obtained succsessfuly',
        meal
    })
})

exports.createMeal = catchAsync(async (req, res, next) => {
    const { restaurant } = req

    const { name, price } = req.body

    const newMeal = await Meal.create({
        name: name.toLowerCase(),
        price,
        restaurantId: restaurant.id
    })

    res.status(200).json({
        status: 'sucsses',
        message: 'Meal create sucsessfully',
        newMeal
    })
})

exports.updateMeal = catchAsync(async (req, res, next) => {
    const { meal } = req

    const { name, price } = req.body

    const updateMeal = await meal.update({
        name: name.toLowerCase(),
        price
    })

    res.status(200).json({
        status: 'sucsses',
        message: 'The meal update sucsessfully',
        updateMeal
    })
})

exports.deleteMeal = catchAsync(async (req, res, next) => {
    const { meal } = req

    await meal.update({
        status: 'delete'
    })

    res.status(200).json({
        status: 'sucsses',
        message: 'The Meal Delete'
    })
})