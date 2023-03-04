const Meal = require("../models/meals.model");
const Order = require("../models/orders.model");
const Restaurant = require("../models/restaurants.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllOrdersUser = catchAsync(async (req, res, next) => {
    const { sessionUser } = req

    const orders = await Order.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: {
            userId: sessionUser.id,
            status: 'active'
        },
        include: [
            {
                model: Meal,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: [
                    {
                        model: Restaurant,
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    }
                ]
            }
        ]
    })

    res.status(200).json({
        status: 'sucsses',
        message: 'Orders successfully obtained',
        orders
    })
})

exports.createOrder = catchAsync(async (req, res, next) => {
    const { sessionUser } = req
    const { quantity, mealId } = req.body

    // TODO: convertir a middleware
    const meal = await Meal.findOne({
        where: {
            id: mealId,
            status: 'active'
        }
    })

    if (!meal) {
        return next(new AppError('Order not fount', 400))
    }

    const priceTotal = meal.price * quantity

    const newOrder = await Order.create({
        quantity,
        mealId: meal.id,
        totalPrice: priceTotal,
        userId: sessionUser.id
    })

    res.status(200).json({
        status: 'sucsses',
        message: 'order created successfully',
        newOrder: {
            id: newOrder.id,
            mealId: newOrder.mealId,
            userId: newOrder.userId,
            totalPrice: newOrder.totalPrice,
            quantity: newOrder.quantity,
            status: newOrder.status
        }
    })
})

exports.updateOrder = catchAsync(async (req, res, next) => {
    const { order } = req

    await order.update({ status: 'completed' })

    res.status(200).json({
        status: 'sucsses',
        message: 'the order was successfully updated'
    })
})

exports.deleteOrder = catchAsync(async (req, res, next) => {
    const { order } = req

    await order.update({ status: 'canceled' })

    res.status(200).json({
        status: 'sucsses',
        message: 'the order was successfully canceled'
    })
})