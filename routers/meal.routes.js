const { Router } = require("express");
const {
    createMeal,
    getAllMeals,
    getMealById,
    updateMeal,
    deleteMeal
} = require("../controllers/meal.controllers");

const {
    restrictTo,
    protect
} = require("../middlewares/auth/auth.middleware");

const {
    validRestaurantById,
    validMeal
} = require("../middlewares/restaurant.middleware");

const router = Router()

router.get('/', getAllMeals)

router.get('/:id', validMeal, getMealById)

router.use(protect)

router.post('/:id', validRestaurantById, restrictTo('admin'), createMeal)

router.patch('/:id', validMeal, restrictTo('admin'), updateMeal)

router.delete('/:id', validMeal, restrictTo('admin'), deleteMeal)

module.exports = {
    mealRouter: router
}