const Restaurant = require("../models/restaurants.model")
const Review = require("../models/reviews.model")
const catchAsync = require("../utils/catchAsync")

exports.getAllRestaurants = catchAsync(async (req, res, next) => {
    const restaurant = await Restaurant.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: {
            status: 'active'
        },
        include: [
            {
                model: Review,
                attributes: {
                    exclude: [
                        'createdAt',
                        'updatedAt'
                    ]
                },
                where: {
                    status: 'active'
                }
            }
        ]
    })

    res.status(200).json({
        status: 'sucsses',
        message: 'all restaurants successfully obtained',
        restaurant
    })
})

exports.getRestaurantById = catchAsync(async (req, res, next) => {
    const { restaurant } = req

    res.status(200).json({
        status: 'sucsses',
        message: 'the restaurant was successfully obtained',
        restaurant
    })
})

exports.createNewRestaurant = catchAsync(async (req, res, next) => {
    const { name, address, rating } = req.body

    const newRestaurant = await Restaurant.create({
        name: name.toLowerCase(),
        address: address.toLowerCase(),
        rating
    })

    res.status(200).json({
        status: 'sucsses',
        message: 'The restaurant was successfully created',
        newRestaurant
    })
})

exports.updateRestaurant = catchAsync(async (req, res, next) => {
    const { restaurant } = req

    const { name, address } = req.body

    const updateRestaurant = await restaurant.update({
        name: name.toLowerCase(),
        address: address.toLowerCase()
    })

    res.status(201).json({
        status: 'sucsses',
        message: 'successfully updated restaurant',
        updateRestaurant
    })
})

exports.disableRestaurantStatus = catchAsync(async (req, res, next) => {
    const { restaurant } = req

    await restaurant.update({
        status: 'disable'
    })

    res.status(200).json({
        status: 'sucsses',
        message: 'the restaurant has been successfully disabled'
    })
})

exports.createReview = catchAsync(async (req, res, next) => {
    const { restaurant, sessionUser } = req

    const { comment, rating } = req.body

    const newReview = await Review.create({
        restaurantId: restaurant.id,
        comment: comment.toLowerCase(),
        rating,
        userId: sessionUser.id
    })

    res.status(200).json({
        status: 'sucsses',
        message: 'review created successfully',
        newReview: {
            id: newReview.id,
            restaurantId: newReview.restaurantId,
            userId: newReview.userId,
            status: newReview.status,
            rating: newReview.rating,
            comment: newReview.comment
        }
    })
})

exports.updateUserReview = catchAsync(async (req, res, next) => {
    const { review, restaurant, sessionUser } = req

    const { comment, rating } = req.body

    const updateReview = await review.update({
        comment: comment.toLowerCase(),
        rating,
        userId: sessionUser.id,
        restaurantId: restaurant.id
    })

    res.status(200).json({
        status: 'sucsses',
        message: 'review update successfully',
        updateReview: {
            id: updateReview.id,
            userId: updateReview.userId,
            restaurantId: updateReview.restaurantId,
            comment: updateReview.comment,
            rating: updateReview.rating,
            status: updateReview.status
        }
    })
})

exports.deleteUserReview = catchAsync(async (req, res, next) => {
    const { review, restaurant, sessionUser } = req

    await review.update({
        restaurantId: restaurant.id,
        userId: sessionUser.id,
        status: 'deleted'
    })

    res.status(200).json({
        status: 'sucsses',
        message: 'Review eliminada'
    })
})
