const { Router } = require("express")
const { check } = require("express-validator")
const { getAllRestaurants, createNewRestaurant, getRestaurantById, updateRestaurant, disableRestaurantStatus, deleteUserReview, createReview, updateUserReview } = require("../controllers/restaurant.controller")
const { restrictTo, protect } = require("../middlewares/auth/auth.middleware")
const { validRestaurantById, validReview } = require("../middlewares/restaurant.middleware")
const { validateFields } = require("../middlewares/validateField.middleware")

const router = Router()

router.get('/', getAllRestaurants)

router.post('/', [
    check('name', 'The name Restaurant is require').not().isEmpty(),
    check('address', 'The address Restaurant is require').not().isEmpty(),
    check('rating', 'The rating Restaurant is require').not().isEmpty(),
    validateFields,
    protect,
    restrictTo('admin')
], createNewRestaurant)

router.get('/:id', validRestaurantById, getRestaurantById)

router.use(protect)

router.post('/reviews/:id', validRestaurantById, restrictTo('client'), createReview)

router.patch('/:id', [
    check('name', 'The name Restaurant is require').not().isEmpty(),
    check('address', 'The address Restaurant is require').not().isEmpty(),
    validateFields,
    validRestaurantById,
    restrictTo('admin')
], updateRestaurant)

router.patch('/reviews/:restaurantId/:id', [
    check('comment', 'The comment is require').not().isEmpty(),
    check('rating', 'The rating Restaurant is require').not().isEmpty(),
    validateFields,
    validReview,
    validRestaurantById,
    restrictTo('client')
], updateUserReview)

router.delete('/:id', validRestaurantById, restrictTo('admin'), disableRestaurantStatus)

router.delete('/reviews/:restaurantId/:id', validRestaurantById, validReview, restrictTo('client'), deleteUserReview)

module.exports = {
    restaurantRouter: router
}